import { describe, expect, it } from 'vitest';

import { linkFormSchema } from './link-dialog';

const accepts = (url: string) => linkFormSchema.safeParse({ url }).success;

describe('link dialog url validation', () => {
    it('accepts full urls, including the ones the content picker inserts', () => {
        expect(
            accepts('https://hikka.io/anime/fullmetal-alchemist-c1cd53'),
        ).toBe(true);
        expect(accepts('http://example.com')).toBe(true);
    });

    it('requires a scheme', () => {
        expect(accepts('/anime/fullmetal-alchemist-c1cd53')).toBe(false);
        expect(accepts('hikka.io/anime/x')).toBe(false);
    });
});
