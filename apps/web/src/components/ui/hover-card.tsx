import { PreviewCard as PreviewCardPrimitive } from '@base-ui/react/preview-card';

import { STAY_ON_AXIS } from '@/components/ui/popup-positioning';
import { cn } from '@/utils/cn';

const HoverCardPortal = PreviewCardPrimitive.Portal;

const HoverCardArrow = PreviewCardPrimitive.Arrow;

function HoverCard({ ...props }: PreviewCardPrimitive.Root.Props) {
    return <PreviewCardPrimitive.Root data-slot="hover-card" {...props} />;
}

function HoverCardTrigger({ ...props }: PreviewCardPrimitive.Trigger.Props) {
    return (
        <PreviewCardPrimitive.Trigger
            data-slot="hover-card-trigger"
            {...props}
        />
    );
}

function HoverCardContent({
    className,
    align = 'center',
    alignOffset = 0,
    side = 'bottom',
    sideOffset = 4,
    ...props
}: PreviewCardPrimitive.Popup.Props &
    Pick<
        PreviewCardPrimitive.Positioner.Props,
        'align' | 'alignOffset' | 'side' | 'sideOffset'
    >) {
    return (
        <PreviewCardPrimitive.Portal data-slot="hover-card-portal">
            <PreviewCardPrimitive.Positioner
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
                collisionAvoidance={STAY_ON_AXIS}
                className="isolate z-50"
            >
                <PreviewCardPrimitive.Popup
                    data-slot="hover-card-content"
                    className={cn(
                        'z-50 w-64 origin-(--transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden transition-[opacity,scale,translate] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 data-[side=bottom]:data-starting-style:-translate-y-1 data-[side=bottom]:data-ending-style:-translate-y-1 data-[side=top]:data-starting-style:translate-y-1 data-[side=top]:data-ending-style:translate-y-1 data-[side=left]:data-starting-style:translate-x-1 data-[side=left]:data-ending-style:translate-x-1 data-[side=right]:data-starting-style:-translate-x-1 data-[side=right]:data-ending-style:-translate-x-1',
                        className,
                    )}
                    {...props}
                />
            </PreviewCardPrimitive.Positioner>
        </PreviewCardPrimitive.Portal>
    );
}

export {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
};
