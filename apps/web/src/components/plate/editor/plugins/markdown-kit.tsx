import {
    convertChildrenDeserialize,
    convertNodesSerialize,
    type DeserializeMdOptions,
    defaultRules,
    MarkdownPlugin,
    remarkMention,
    type SerializeMdOptions,
} from '@platejs/markdown';
import type { ContainerDirective } from 'mdast-util-directive';
import { KEYS, type TElement } from 'platejs';
import remarkDirective from 'remark-directive';

import type { TMentionElement } from '@/components/plate/ui/mention-node';

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

// The viewer keeps its own copy of this prefix: importing it would pull the
// whole Plate markdown chain into the react-markdown bundle.
const MENTION_URL_PREFIX = 'mention:';

const MENTION_MDAST_TYPE = 'mentionLink';

// `remarkMention` emits `displayText` only for the `[text](mention:id)` form;
// a bare `@name` carries the name in `username` and gets no reference.
type MdastMention = {
    displayText?: string;
    username: string;
};

type MdastMentionLink = {
    type: typeof MENTION_MDAST_TYPE;
    value: string;
    key?: string;
};

const stripSigil = (value: string) => value.replace(/^@/, '');

const mentionRule = {
    deserialize: (mdastNode: MdastMention): TMentionElement => ({
        type: KEYS.mention,
        children: [{ text: '' }],
        value: stripSigil(mdastNode.displayText ?? mdastNode.username),
        ...(mdastNode.displayText && { key: mdastNode.username }),
    }),
    serialize: (node: TMentionElement): MdastMentionLink => ({
        type: MENTION_MDAST_TYPE,
        value: node.value,
        key: node.key,
    }),
};

// Written raw rather than as an mdast link: remark-stringify escapes `_` in the
// label and `:` in the url, and `@second\_user` no longer matches the
// `@([a-zA-Z0-9_]+)` scan the backend runs to raise tag notifications.
const mentionHandler = (node: MdastMentionLink) =>
    node.key
        ? `[@${node.value}](${MENTION_URL_PREFIX}${encodeURIComponent(node.key)})`
        : `@${node.value}`;

type StringifyHandlers = NonNullable<
    NonNullable<SerializeMdOptions['remarkStringifyOptions']>['handlers']
>;

const mentionHandlers = {
    [MENTION_MDAST_TYPE]: mentionHandler,
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
                ...(mentions && { mention: mentionRule }),
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
