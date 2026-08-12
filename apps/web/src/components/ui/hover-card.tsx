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
                        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-closed:fade-out-0 data-closed:zoom-out-95 data-open:fade-in-0 data-open:zoom-in-95 z-50 w-64 origin-(--transform-origin) rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-hidden data-closed:animate-out data-open:animate-in',
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
