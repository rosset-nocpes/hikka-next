import { Progress as ProgressPrimitive } from '@base-ui/react/progress';

import { cn } from '@/utils/cn';

function Progress({
    className,
    value,
    max,
    ...props
}: ProgressPrimitive.Root.Props) {
    return (
        <ProgressPrimitive.Root
            data-slot="progress"
            value={value}
            max={max}
            className={cn(
                'relative h-4 w-full overflow-hidden rounded-full bg-primary-foreground/10',
                className,
            )}
            {...props}
        >
            <ProgressPrimitive.Track
                data-slot="progress-track"
                className="size-full"
            >
                <ProgressPrimitive.Indicator
                    data-slot="progress-indicator"
                    className="size-full flex-1 bg-primary-foreground transition-all"
                />
            </ProgressPrimitive.Track>
        </ProgressPrimitive.Root>
    );
}

export { Progress };
