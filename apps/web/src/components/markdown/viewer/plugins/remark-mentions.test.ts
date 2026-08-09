import type { Root } from 'mdast';
import { describe, expect, it } from 'vitest';

import remarkMentions from './remark-mentions';

const REFERENCE = '58f47b8e-4d3b-4b9f-9a0b-7c2d9f0a1b23';

const paragraph = (...children: any[]): Root => ({
    type: 'root',
    children: [{ type: 'paragraph', children }],
});

const link = (url: string, label: string) => ({
    type: 'link',
    url,
    children: [{ type: 'text', value: label }],
});

const run = (tree: Root) => {
    remarkMentions()(tree);

    return (tree.children[0] as any).children;
};

describe('remark mentions', () => {
    it('leaves the label of a user link as plain text', () => {
        const [node] = run(
            paragraph(link(`https://hikka.io/u/${REFERENCE}`, '@olexh')),
        );

        expect(node.children).toEqual([{ type: 'text', value: '@olexh' }]);
    });

    it('renders a legacy mention link as a mention', () => {
        const [node] = run(paragraph(link(`mention:${REFERENCE}`, '@olexh')));

        expect(node.data.hName).toBe('mention');
        expect(node.data.hProperties).toEqual({
            username: 'olexh',
            reference: REFERENCE,
        });
        expect(node.children).toEqual([{ type: 'text', value: '@olexh' }]);
    });

    it('still turns a bare mention in running text into one', () => {
        const nodes = run(
            paragraph({ type: 'text', value: 'дякую @olexh за пораду' }),
        );

        const mention = nodes.find(
            (node: any) => node.data?.hName === 'mention',
        );

        expect(mention).toBeTruthy();
        expect(mention.data.hProperties.username).toBe('olexh');
    });
});
