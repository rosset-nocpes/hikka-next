import type { Link, Parent, PhrasingContent, Root } from 'mdast';
import { findAndReplace } from 'mdast-util-find-and-replace';

const userGroup = '[\\da-z][-\\da-z_]{0,38}';
const mentionRegex = new RegExp(`(?:^|\\s)@(${userGroup})`, 'gi');

const MENTION_URL_PREFIX = 'mention:';

const isParent = (node: unknown): node is Parent =>
    Array.isArray((node as Parent).children);

const linkLabel = (node: Parent): string =>
    node.children
        .map((child) => {
            if (child.type === 'text') return child.value;
            return isParent(child) ? linkLabel(child) : '';
        })
        .join('');

function markMentionLinks(node: Parent) {
    for (const child of node.children) {
        if (child.type === 'link' && child.url.startsWith(MENTION_URL_PREFIX)) {
            child.data = {
                ...child.data,
                hName: 'mention',
                hProperties: {
                    username: linkLabel(child).replace(/^@/, ''),
                    reference: decodeURIComponent(
                        child.url.slice(MENTION_URL_PREFIX.length),
                    ),
                },
            };
            continue;
        }

        if (isParent(child)) markMentionLinks(child);
    }
}

export default function remarkMentions(
    opts = { usernameLink: (username: string) => `/${username}` },
) {
    return (tree: Root) => {
        markMentionLinks(tree);
        findAndReplace(tree, [[mentionRegex, replaceMention]]);
    };

    function replaceMention(
        value: string,
        username: string,
    ): PhrasingContent[] {
        const whitespace: PhrasingContent[] = [];

        if (value.indexOf('@') > 0) {
            whitespace.push({
                type: 'text',
                value: value.substring(0, value.indexOf('@')),
            });
        }

        const mention: Link = {
            type: 'link',
            url: opts.usernameLink(username),
            children: [{ type: 'text', value: value.trim() }],
            data: {
                hName: 'mention',
                hProperties: { username },
            },
        };

        return [...whitespace, mention];
    }
}
