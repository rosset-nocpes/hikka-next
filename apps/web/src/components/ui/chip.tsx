import type { ComponentProps } from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { useAsChild } from '@/components/ui/use-as-child';
import { cn } from '@/utils/cn';

// Shared shell for small pill-style controls (feed badges, content refs, quick
// filters). `interactive` re-adds the pointer cursor + focus ring that
// Tailwind's reset strips from <button>; pass `interactive={false}` for static
// display badges.
const chipVariants = cva(
    'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md px-3 font-medium text-xs transition-colors',
    {
        variants: {
            interactive: {
                true: 'cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring',
                false: '',
            },
        },
        defaultVariants: {
            interactive: true,
        },
    },
);

type ChipProps = ComponentProps<'button'> &
    VariantProps<typeof chipVariants> & {
        asChild?: boolean;
    };

function Chip({
    className,
    interactive,
    asChild = false,
    type = 'button',
    children,
    ...props
}: ChipProps) {
    return useAsChild({
        asChild,
        children,
        element: 'button',
        props: {
            type: asChild ? undefined : type,
            className: cn(chipVariants({ interactive }), className),
            ...props,
        },
    });
}

export { Chip, chipVariants };
