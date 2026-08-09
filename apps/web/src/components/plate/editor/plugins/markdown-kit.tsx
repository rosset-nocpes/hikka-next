import {
    convertChildrenDeserialize,
    convertNodesSerialize,
    type DeserializeMdOptions,
    defaultRules,
    MarkdownPlugin,
    type MdRules,
    remarkMention,
    type SerializeMdOptions,
} from '@platejs/markdown';
import type { ContainerDirective } from 'mdast-util-directive';
import { KEYS, type TElement } from 'platejs';
import remarkDirective from 'remark-directive';

import { isMentionLabel, isUserUrl, userMentionUrl } from '@/utils/mentions';

import { ELEMENT_SPOILER } from './spoiler-kit';

// Per container-directive type (:::name blocks)
interface DirectiveConfig {
    deserialize: (
        mdastNode: ContainerDirective,
        deco: Parameters<typeof convertChildrenDeserialize>[1],
        options: DeserializeMdOptions,
    ) => TElement;
    serialize: (
        plateNode: TElement,
        options: SerializeMdOptions,
    ) => ContainerDirective;
}

const directiveConfigs: Record<string, DirectiveConfig> = {
    [ELEMENT_SPOILER]: {
        deserialize: (mdastNode, deco, options) => ({
            type: ELEMENT_SPOILER,
            children: convertChildrenDeserialize(
                mdastNode.children,
                deco,
                options,
            ),
        }),
        serialize: (plateNode, options) => ({
            type: 'containerDirective',
            name: ELEMENT_SPOILER,
            children: convertNodesSerialize(
                plateNode.children,
                options,
            ) as ContainerDirective['children'],
        }),
    },
    // Add more directive types here as needed (e.g. callout)
};

const isBlankParagraph = ({ children }: TElement) =>
    children.length === 1 && 'text' in children[0] && children[0].text === '';

type DefaultParagraphRule = {
    serialize: NonNullable<NonNullable<typeof defaultRules.p>['serialize']>;
};

const paragraphRule = {
    serialize: (node: TElement, options: SerializeMdOptions) =>
        (defaultRules.p as DefaultParagraphRule).serialize(node, {
            ...options,
            preserveEmptyParagraphs: isBlankParagraph(node)
                ? options.preserveEmptyParagraphs
                : false,
        }),
};

const MENTION_MDAST_TYPE = 'userLink';

// `remarkMention` emits `displayText` only for the legacy `[text](mention:id)`
// form; a bare `@name` carries the name in `username` and gets no reference.
type MdastMention = {
    displayText?: string;
    username: string;
};

type MdastUserLink = {
    type: typeof MENTION_MDAST_TYPE;
    label: string;
    url: string;
};

const stripSigil = (value: string) => value.replace(/^@/, '');

// Both legacy spellings land on the link the picker writes today. The bare form
// has no reference, so it points at the username instead.
const mentionRule = {
    deserialize: (mdastNode: MdastMention): TElement => {
        const username = stripSigil(
            mdastNode.displayText ?? mdastNode.username,
        );

        return {
            type: KEYS.a,
            url: userMentionUrl(
                mdastNode.displayText ? mdastNode.username : username,
            ),
            children: [{ text: `@${username}` }],
        };
    },
};

type LinkRule = NonNullable<typeof defaultRules.a>;
type DefaultLinkSerialize = NonNullable<LinkRule['serialize']>;
type LinkNode = Parameters<DefaultLinkSerialize>[0];

const labelOf = (node: LinkNode) =>
    node.children.length === 1 && 'text' in node.children[0]
        ? (node.children[0].text as string)
        : '';

const linkRule = {
    serialize: (node: LinkNode, options: SerializeMdOptions) => {
        const label = labelOf(node);
        const url = node.url ?? '';

        if (!isMentionLabel(label) || !isUserUrl(url)) {
            return (defaultRules.a?.serialize as DefaultLinkSerialize)(
                node,
                options,
            );
        }

        return { type: MENTION_MDAST_TYPE, label, url };
    },
};

// Both rules only apply where legacy mention syntax can appear: comments.
const mentionRules = {
    mention: mentionRule,
    a: linkRule,
} as unknown as MdRules;

// Written raw rather than as an mdast link: remark-stringify escapes `_` in the
// label, and `@second\_user` no longer matches the `@([a-zA-Z0-9_]+)` scan the
// backend runs to raise tag notifications.
const userLinkHandler = (node: MdastUserLink) => `[${node.label}](${node.url})`;

type StringifyHandlers = NonNullable<
    NonNullable<SerializeMdOptions['remarkStringifyOptions']>['handlers']
>;

const mentionHandlers = {
    [MENTION_MDAST_TYPE]: userLinkHandler,
} as StringifyHandlers;

type MarkdownKitOptions = {
    mentions?: boolean;
};

export const createMarkdownKit = ({
    mentions = false,
}: MarkdownKitOptions = {}) => [
    MarkdownPlugin.configure({
        options: {
            disallowedNodes: [KEYS.suggestion, KEYS.codeBlock, KEYS.code],
            remarkPlugins: mentions
                ? [remarkDirective, remarkMention]
                : [remarkDirective],

            remarkStringifyOptions: {
                resourceLink: true,
                ...(mentions && { handlers: mentionHandlers }),
            },

            rules: {
                p: paragraphRule,
                ...(mentions && mentionRules),
                // Markdown -> Plate: one entry point for all container directives
                containerDirective: {
                    deserialize: (mdastNode, deco, options) =>
                        directiveConfigs[mdastNode.name]?.deserialize(
                            mdastNode,
                            deco,
                            options,
                        ),
                },
                // Plate -> Markdown: one rule per registered directive type
                ...Object.fromEntries(
                    Object.entries(directiveConfigs).map(([name, config]) => [
                        name,
                        { serialize: config.serialize },
                    ]),
                ),
            },
        },
    }),
];

export const MarkdownKit = createMarkdownKit();
