import * as React from 'react';

import { Dialog as SheetPrimitive } from '@base-ui/react/dialog';
import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { PortalContainerProvider } from '@/components/ui/portal-container-context';
import {
    Sheet,
    SheetClose,
    SheetFooter,
    SheetOverlay,
    SheetPortal,
    SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/utils/cn';

// A full-screen sheet has no outside. Outside-dismiss resolves on the click
// phase, so without this the tap that closes a sheet above this one lands here
// afterwards and dismisses this one too.
function PageSheet({
    disablePointerDismissal = true,
    ...props
}: SheetPrimitive.Root.Props) {
    return (
        <Sheet disablePointerDismissal={disablePointerDismissal} {...props} />
    );
}

function PageSheetContent({
    className,
    children,
    ...props
}: SheetPrimitive.Popup.Props) {
    const [container, setContainer] = React.useState<HTMLElement | null>(null);

    return (
        <SheetPortal>
            <SheetOverlay />
            <SheetPrimitive.Popup
                ref={setContainer}
                data-slot="page-sheet-content"
                className={cn(
                    'fixed inset-0 z-50 flex h-full w-full flex-col gap-4 bg-background bg-clip-padding p-4 pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-[calc(1rem+var(--safe-area-bottom))] text-sm transition-[opacity,translate] duration-200 ease-in-out data-ending-style:translate-x-full data-ending-style:opacity-0 data-starting-style:translate-x-full data-starting-style:opacity-0',
                    className,
                )}
                {...props}
            >
                <PortalContainerProvider value={container}>
                    {children}
                </PortalContainerProvider>
            </SheetPrimitive.Popup>
        </SheetPortal>
    );
}

type PageSheetHeaderProps = {
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
};

function PageSheetHeader({
    title,
    subtitle,
    actions,
    className,
}: PageSheetHeaderProps) {
    return (
        <div
            data-slot="page-sheet-header"
            className={cn(
                '-mx-4 -mt-4 flex h-14 shrink-0 items-center gap-1 border-b px-2',
                className,
            )}
        >
            <SheetClose
                render={
                    <Button
                        variant="ghost"
                        size="icon-md"
                        className="[&_svg]:size-6"
                        aria-label="Назад"
                    />
                }
            >
                <ChevronLeft />
            </SheetClose>
            <div className="flex min-w-0 flex-1 flex-col justify-center">
                <SheetPrimitive.Title className="truncate font-semibold text-sm">
                    {title}
                </SheetPrimitive.Title>
                {subtitle && (
                    <SheetPrimitive.Description className="truncate text-muted-foreground text-xs">
                        {subtitle}
                    </SheetPrimitive.Description>
                )}
            </div>
            {actions && (
                <div className="flex shrink-0 items-center gap-2">
                    {actions}
                </div>
            )}
        </div>
    );
}

export {
    PageSheet,
    PageSheetContent,
    PageSheetHeader,
    SheetClose as PageSheetClose,
    SheetFooter as PageSheetFooter,
    SheetTrigger as PageSheetTrigger,
};
