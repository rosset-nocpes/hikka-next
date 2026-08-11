import * as React from 'react';

import { Tooltip as TooltipPrimitive } from '@base-ui/react/tooltip';

import { cn } from '@/utils/cn';

function TooltipProvider({
    delay = 0,
    ...props
}: TooltipPrimitive.Provider.Props) {
    return (
        <TooltipPrimitive.Provider
            data-slot="tooltip-provider"
            delay={delay}
            {...props}
        />
    );
}

// Base UI keeps `delay` on the provider, so a per-tooltip delay needs its own provider.
function Tooltip({
    delay,
    ...props
}: TooltipPrimitive.Root.Props & { delay?: number }) {
    const root = <TooltipPrimitive.Root data-slot="tooltip" {...props} />;

    if (delay === undefined) return root;

    return <TooltipProvider delay={delay}>{root}</TooltipProvider>;
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />;
}

const TooltipPortal = TooltipPrimitive.Portal;

const TooltipArrow = TooltipPrimitive.Arrow;

function TooltipContent({
    className,
    side = 'top',
    sideOffset = 4,
    align = 'center',
    alignOffset = 0,
    children,
    ...props
}: TooltipPrimitive.Popup.Props &
    Pick<
        TooltipPrimitive.Positioner.Props,
        'align' | 'alignOffset' | 'side' | 'sideOffset'
    >) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Positioner
                align={align}
                alignOffset={alignOffset}
                side={side}
                sideOffset={sideOffset}
                className="isolate z-50"
            >
                <TooltipPrimitive.Popup
                    data-slot="tooltip-content"
                    className={cn(
                        'fade-in-0 zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--transform-origin) animate-in text-balance rounded-md bg-tooltip px-3 py-1.5 text-tooltip-foreground text-xs shadow-md data-closed:animate-out',
                        className,
                    )}
                    {...props}
                >
                    {children}
                    {/* Base UI positions the arrow along the edge inline; the offset only centres
                        the rotated square on that edge, so half of it stays under the popup. */}
                    <TooltipPrimitive.Arrow className="size-2.5 rotate-45 rounded-[2px] bg-tooltip fill-tooltip data-[side=bottom]:-top-[3px] data-[side=left]:-right-[3px] data-[side=right]:-left-[3px] data-[side=top]:-bottom-[3px]" />
                </TooltipPrimitive.Popup>
            </TooltipPrimitive.Positioner>
        </TooltipPrimitive.Portal>
    );
}

function withTooltip<
    T extends React.ComponentType<any> | keyof HTMLElementTagNameMap,
>(Component: T) {
    return React.forwardRef<
        React.ComponentRef<T>,
        {
            tooltip?: React.ReactNode;
            tooltipContentProps?: Omit<
                React.ComponentProps<typeof TooltipContent>,
                'children'
            >;
            tooltipProps?: Omit<TooltipPrimitive.Root.Props, 'children'>;
        } & React.ComponentPropsWithoutRef<T>
    >(function ExtendComponent(
        { tooltip, tooltipContentProps, tooltipProps, ...props },
        ref,
    ) {
        const [mounted, setMounted] = React.useState(false);

        React.useEffect(() => {
            setMounted(true);
        }, []);

        const component = <Component ref={ref} {...(props as any)} />;

        if (tooltip && mounted) {
            return (
                <Tooltip {...tooltipProps}>
                    <TooltipTrigger render={component} />
                    <TooltipContent {...tooltipContentProps}>
                        {tooltip}
                    </TooltipContent>
                </Tooltip>
            );
        }

        return component;
    });
}

export {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipPortal,
    TooltipProvider,
    TooltipTrigger,
    withTooltip,
};
