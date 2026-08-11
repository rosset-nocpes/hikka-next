import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/utils/cn';

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
    return (
        <CheckboxPrimitive.Root
            data-slot="checkbox"
            className={cn(
                'peer grid size-4 shrink-0 place-content-center rounded-sm border border-primary-border ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 data-checked:bg-primary data-checked:text-primary-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="checkbox-indicator"
                className={cn('grid place-content-center text-current')}
            >
                <Check className="size-4!" />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
