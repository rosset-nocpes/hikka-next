import { Toggle as TogglePrimitive } from '@base-ui/react/toggle';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

// On-state is styled via both `data-pressed` and `aria-checked`: wrapping an
// item in a tooltip trigger overwrites the toggle's own state attributes,
// while `aria-checked` stays owned by the toggle group.
const toggleVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-md border border-transparent bg-transparent font-medium text-foreground/60 text-sm transition-all hover:text-foreground focus-visible:border-ring focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 data-pressed:bg-primary data-pressed:text-foreground aria-checked:bg-primary aria-checked:text-foreground dark:text-muted-foreground dark:hover:text-foreground dark:data-pressed:text-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
    {
        variants: {
            size: {
                default: 'h-8 min-w-8 px-2.5',
                sm: 'h-8 min-w-8 px-2',
                lg: 'h-10 min-w-10 px-4',
                badge: 'px-3 py-0.5 text-xs',
            },
        },
        defaultVariants: {
            size: 'default',
        },
    },
);

function Toggle({
    className,
    size,
    ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
    return (
        <TogglePrimitive
            data-slot="toggle"
            className={cn(toggleVariants({ size, className }))}
            {...props}
        />
    );
}

export { Toggle, toggleVariants };
