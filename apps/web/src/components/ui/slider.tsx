import * as React from 'react';

import { Slider as SliderPrimitive } from '@base-ui/react/slider';

import { cn } from '@/utils/cn';

import { Badge } from './badge';

type ShowValueMode = 'always' | 'on-interaction' | 'never';

type SliderProps = SliderPrimitive.Root.Props<number[]> & {
    /**
     * Controls when to display value above thumb
     * - "always": Value is always visible above thumb
     * - "on-interaction": Value shows on hover and during drag
     * - "never": No value display (default)
     */
    showValue?: ShowValueMode;
    formatValue?: (value: number) => React.ReactNode;
};

type ThumbWithValueProps = {
    value: number;
    showValue: ShowValueMode;
    formatValue?: (value: number) => React.ReactNode;
    isInteracting: boolean;
    onInteractionStart: () => void;
    onInteractionEnd: () => void;
};

function ThumbWithValue({
    value,
    showValue,
    formatValue,
    isInteracting,
    onInteractionStart,
    onInteractionEnd,
}: ThumbWithValueProps) {
    const [isHovered, setIsHovered] = React.useState(false);

    const shouldShowValue =
        showValue === 'always' ||
        (showValue === 'on-interaction' && (isHovered || isInteracting));

    const displayValue = formatValue ? formatValue(value) : value;

    return (
        <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            className="group relative block size-5 rounded-full border-2 border-primary-foreground bg-primary ring-offset-primary transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 data-disabled:pointer-events-none data-disabled:opacity-50"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onPointerDown={onInteractionStart}
            onPointerUp={onInteractionEnd}
        >
            {showValue !== 'never' && (
                <Badge
                    variant="secondary"
                    className={cn(
                        'absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transition-opacity',
                        showValue === 'always' && 'opacity-100',
                        showValue === 'on-interaction' &&
                            (shouldShowValue
                                ? 'opacity-100'
                                : 'pointer-events-none opacity-0'),
                    )}
                >
                    {displayValue}
                </Badge>
            )}
        </SliderPrimitive.Thumb>
    );
}

function Slider({
    className,
    value,
    showValue = 'never',
    formatValue,
    ...props
}: SliderProps) {
    const [isInteracting, setIsInteracting] = React.useState(false);

    React.useEffect(() => {
        if (!isInteracting) return;

        const handlePointerUp = () => setIsInteracting(false);
        document.addEventListener('pointerup', handlePointerUp);
        return () => document.removeEventListener('pointerup', handlePointerUp);
    }, [isInteracting]);

    const values = Array.isArray(value) ? value : value != null ? [value] : [0];

    return (
        <SliderPrimitive.Root
            data-slot="slider"
            className={cn(
                'relative w-full touch-none select-none',
                showValue === 'always' && 'pt-6',
                className,
            )}
            value={value}
            {...props}
        >
            {/* Base UI centres each thumb on its value, so the track has to be
                inset by half a thumb to keep the travel inside the root. */}
            <SliderPrimitive.Control
                data-slot="slider-control"
                className="flex w-full items-center px-2.5"
            >
                <SliderPrimitive.Track
                    data-slot="slider-track"
                    className="relative my-2 h-2 w-full grow rounded-full bg-primary-foreground/20"
                >
                    <SliderPrimitive.Indicator
                        data-slot="slider-indicator"
                        className="absolute h-full rounded-full bg-primary-foreground"
                    />
                    {values.map((thumbValue, index) => (
                        <ThumbWithValue
                            key={index}
                            value={thumbValue}
                            showValue={showValue}
                            formatValue={formatValue}
                            isInteracting={isInteracting}
                            onInteractionStart={() => setIsInteracting(true)}
                            onInteractionEnd={() => setIsInteracting(false)}
                        />
                    ))}
                </SliderPrimitive.Track>
            </SliderPrimitive.Control>
        </SliderPrimitive.Root>
    );
}

export type { ShowValueMode, SliderProps };
export { Slider };
