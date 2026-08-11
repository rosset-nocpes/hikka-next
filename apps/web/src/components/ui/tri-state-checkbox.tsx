import type * as React from 'react';

import { Checkbox as CheckboxPrimitive } from '@base-ui/react/checkbox';
import { Minus, Plus } from 'lucide-react';

import { cn } from '@/utils/cn';

export type TriState = 'include' | 'exclude' | 'neutral';

type TriStateCheckboxProps = Omit<
    CheckboxPrimitive.Root.Props,
    'checked' | 'onCheckedChange' | 'indeterminate'
> & {
    value?: TriState;
    onValueChange?: (value: TriState) => void;
};

function TriStateCheckbox({
    className,
    value = 'neutral',
    onValueChange,
    ...props
}: TriStateCheckboxProps) {
    const handleInteraction = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!onValueChange) return;

        if (value === 'neutral') {
            onValueChange('include');
        } else if (value === 'include') {
            onValueChange('exclude');
        } else {
            onValueChange('neutral');
        }
    };

    return (
        <CheckboxPrimitive.Root
            data-slot="tri-state-checkbox"
            checked={value === 'include'}
            indeterminate={value === 'exclude'}
            onClick={handleInteraction}
            className={cn(
                'peer size-4 shrink-0 rounded-sm border ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 data-disabled:cursor-not-allowed data-disabled:opacity-50',
                'data-checked:bg-success data-checked:text-success-foreground',
                'data-indeterminate:bg-destructive data-indeterminate:text-destructive-foreground',
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator
                data-slot="tri-state-checkbox-indicator"
                className={cn('flex items-center justify-center text-current')}
            >
                {value === 'include' && <Plus className="size-3!" />}
                {value === 'exclude' && <Minus className="size-3!" />}
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { TriStateCheckbox };
