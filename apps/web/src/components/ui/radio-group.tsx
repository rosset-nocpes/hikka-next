import { Radio as RadioPrimitive } from '@base-ui/react/radio';
import { RadioGroup as RadioGroupPrimitive } from '@base-ui/react/radio-group';
import { Circle } from 'lucide-react';

import { cn } from '@/utils/cn';

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
    return (
        <RadioGroupPrimitive
            data-slot="radio-group"
            className={cn('grid gap-2', className)}
            {...props}
        />
    );
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
    return (
        <RadioPrimitive.Root
            data-slot="radio-group-item"
            className={cn(
                'grid size-4 shrink-0 place-content-center rounded-full border border-primary-border ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 data-checked:bg-primary data-checked:text-primary-foreground data-disabled:cursor-not-allowed data-disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <RadioPrimitive.Indicator
                data-slot="radio-group-indicator"
                className="grid place-content-center text-current"
            >
                <Circle className="size-2.5 fill-current" />
            </RadioPrimitive.Indicator>
        </RadioPrimitive.Root>
    );
}

export { RadioGroup, RadioGroupItem };
