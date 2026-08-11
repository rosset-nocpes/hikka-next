import * as React from 'react';

import { Button as ButtonPrimitive } from '@base-ui/react/button';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const statItemVariants = cva('inline-flex items-center text-muted-foreground', {
    variants: {
        size: {
            default:
                'h-8 gap-1 rounded-lg px-2 text-sm font-normal transition-colors hover:bg-accent hover:text-foreground [&_svg]:size-4 [&_svg]:shrink-0',
            sm: 'gap-1 text-xs [&_svg]:size-3 [&_svg]:shrink-0',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

export type StatItemProps = ButtonPrimitive.Props &
    VariantProps<typeof statItemVariants>;

function StatItem({ className, size, type, render, ...props }: StatItemProps) {
    return (
        <ButtonPrimitive
            data-slot="stat-item"
            type={render ? undefined : (type ?? 'button')}
            render={render}
            className={cn(statItemVariants({ size, className }))}
            {...props}
        />
    );
}

const statItemGroupVariants = cva('flex items-center', {
    variants: {
        size: {
            default: 'gap-1',
            sm: 'gap-3',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

export type StatItemGroupProps = React.HTMLAttributes<HTMLDivElement> &
    VariantProps<typeof statItemGroupVariants>;

const StatItemGroup = React.forwardRef<HTMLDivElement, StatItemGroupProps>(
    ({ className, size, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(statItemGroupVariants({ size, className }))}
            {...props}
        />
    ),
);
StatItemGroup.displayName = 'StatItemGroup';

export { StatItem, StatItemGroup, statItemGroupVariants, statItemVariants };
