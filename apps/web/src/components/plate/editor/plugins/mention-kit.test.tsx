import { MarkdownPlugin } from '@platejs/markdown';
import type { Value } from 'platejs';
import { createPlateEditor } from 'platejs/react';
import { describe, expect, it } from 'vitest';

import { ArticleKit } from '../article-kit';
import { MarkdownEditorKit } from '../markdown-editor-kit';

const REFERENCE = '58f47b8e-4d3b-4b9f-9a0b-7c2d9f0a1b23';

// The scan the backend runs over stored comment text to raise tag notifications.
const BACKEND_TAG_REGEX = /@([a-zA-Z0-9_]+)/g;

const makeEditor = (value: Value = [], plugins: any = MarkdownEditorKit) =>
    createPlateEditor({ plugins, value }) as any;

const serialize = (value: Value, plugins?: any) =>
    makeEditor(value, plugins).getApi(MarkdownPlugin).markdown.serialize();

const deserialize = (markdown: string, plugins?: any) =>
    makeEditor([], plugins)
        .getApi(MarkdownPlugin)
        .markdown.deserialize(markdown);

const mention = (value: string, key?: string) => ({
    type: 'mention',
    value,
    children: [{ text: '' }],
    ...(key && { key }),
});

const paragraph = (...children: any[]) => ({ type: 'p', children });

const mentionsOf = (value: Value): any[] =>
    value.flatMap((node: any) =>
        (node.children ?? []).filter((child: any) => child.type === 'mention'),
    );

describe('mention serialization', () => {
    it('keeps the username visible and the reference in the url', () => {
        const markdown = serialize([
            paragraph({ text: 'дякую ' }, mention('olexh', REFERENCE), {
                text: ' за пораду',
            }),
        ]);

        expect(markdown.trim()).toBe(
            `дякую [@olexh](mention:${REFERENCE}) за пораду`,
        );
    });

    it('does not leak the zero-width marker around the mention', () => {
        const markdown = serialize([
            paragraph({ text: '' }, mention('olexh', REFERENCE), { text: '' }),
        ]);

        expect(markdown).not.toContain('​');
    });

    it('stays matchable by the backend tag scan', () => {
        const markdown = serialize([
            paragraph(
                { text: '' },
                mention('olexh', REFERENCE),
                { text: ' та ' },
                mention('second_user', REFERENCE),
            ),
        ]);

        expect(markdown).not.toContain('\\');
        expect(
            [...markdown.matchAll(BACKEND_TAG_REGEX)].map((m) => m[1]),
        ).toEqual(['olexh', 'second_user']);
    });

    it('ends the comment on the mention without an encoded space', () => {
        const markdown = serialize([
            paragraph({ text: 'дякую ' }, mention('olexh', REFERENCE), {
                text: '',
            }),
        ]);

        expect(markdown.trim()).toBe(`дякую [@olexh](mention:${REFERENCE})`);
        expect(markdown).not.toContain('&#x20;');
    });

    it('writes a mention without a reference back as plain text', () => {
        const markdown = serialize([
            paragraph({ text: 'дякую ' }, mention('olexh'), { text: '!' }),
        ]);

        expect(markdown.trim()).toBe('дякую @olexh!');
    });
});

describe('mention deserialization', () => {
    it('reads the reference and drops the sigil from the value', () => {
        const mentions = mentionsOf(
            deserialize(`дякую [@olexh](mention:${REFERENCE}) за пораду`),
        );

        expect(mentions).toHaveLength(1);
        expect(mentions[0].value).toBe('olexh');
        expect(mentions[0].key).toBe(REFERENCE);
    });

    it('reads a legacy bare mention without a reference', () => {
        const mentions = mentionsOf(deserialize('дякую @olexh за пораду'));

        expect(mentions).toHaveLength(1);
        expect(mentions[0].value).toBe('olexh');
        expect(mentions[0].key).toBeUndefined();
    });

    it('leaves a plain link alone', () => {
        expect(mentionsOf(deserialize('[@olexh](/u/olexh)'))).toHaveLength(0);
    });
});

describe('mention round trip', () => {
    it('is stable for a referenced mention', () => {
        const markdown = `дякую [@olexh](mention:${REFERENCE}) за пораду`;

        expect(serialize(deserialize(markdown)).trim()).toBe(markdown);
    });

    it('leaves a legacy comment byte-identical', () => {
        const markdown = 'дякую @olexh за пораду';

        expect(serialize(deserialize(markdown)).trim()).toBe(markdown);
    });

    it('does not backslash-escape an underscore username on either form', () => {
        const legacy = 'дякую @second_user за пораду';
        const referenced = `дякую [@second_user](mention:${REFERENCE}) за пораду`;

        expect(serialize(deserialize(legacy)).trim()).toBe(legacy);
        expect(serialize(deserialize(referenced)).trim()).toBe(referenced);
    });
});

describe('article editor', () => {
    it('does not mint mention nodes the backend document schema rejects', () => {
        const value = deserialize(
            `дякую @olexh та [@second](mention:${REFERENCE})`,
            ArticleKit,
        );

        expect(mentionsOf(value)).toHaveLength(0);
    });
});
