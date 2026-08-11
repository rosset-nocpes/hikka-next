import { NavigationMenu as NavigationMenuPrimitive } from '@base-ui/react/navigation-menu';
import { cva } from 'class-variance-authority';
import { ChevronDownIcon } from 'lucide-react';

import { cn } from '@/utils/cn';

function NavigationMenu({
    className,
    children,
    // Base UI always renders the popup through a portal; the prop is kept so
    // callers written against the Radix API keep compiling.
    viewport = true,
    ...props
}: NavigationMenuPrimitive.Root.Props & {
    viewport?: boolean;
}) {
    return (
        <NavigationMenuPrimitive.Root
            data-slot="navigation-menu"
            data-viewport={viewport}
            className={cn(
                'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center',
                className,
            )}
            {...props}
        >
            {children}
            <NavigationMenuViewport />
        </NavigationMenuPrimitive.Root>
    );
}

function NavigationMenuList({
    className,
    ...props
}: NavigationMenuPrimitive.List.Props) {
    return (
        <NavigationMenuPrimitive.List
            data-slot="navigation-menu-list"
            className={cn(
                'group flex flex-1 list-none items-center justify-center gap-1',
                className,
            )}
            {...props}
        />
    );
}

function NavigationMenuItem({
    className,
    ...props
}: NavigationMenuPrimitive.Item.Props) {
    return (
        <NavigationMenuPrimitive.Item
            data-slot="navigation-menu-item"
            className={cn('relative', className)}
            {...props}
        />
    );
}

const navigationMenuTriggerStyle = cva(
    'group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-[color,box-shadow] outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-accent/50 data-popup-open:text-accent-foreground data-popup-open:hover:bg-accent data-popup-open:focus:bg-accent',
);

function NavigationMenuTrigger({
    className,
    children,
    ...props
}: NavigationMenuPrimitive.Trigger.Props) {
    return (
        <NavigationMenuPrimitive.Trigger
            data-slot="navigation-menu-trigger"
            className={cn(navigationMenuTriggerStyle(), 'group', className)}
            {...props}
        >
            {children}{' '}
            <ChevronDownIcon
                className="relative top-px ml-1 size-3 transition duration-300 group-data-popup-open:rotate-180"
                aria-hidden="true"
            />
        </NavigationMenuPrimitive.Trigger>
    );
}

function NavigationMenuContent({
    className,
    ...props
}: NavigationMenuPrimitive.Content.Props) {
    return (
        <NavigationMenuPrimitive.Content
            data-slot="navigation-menu-content"
            className={cn(
                'data-ending-style:fade-out data-starting-style:fade-in w-full p-2 pr-2.5 data-ending-style:animate-out data-starting-style:animate-in md:w-auto',
                '**:data-[slot=navigation-menu-link]:focus:outline-none **:data-[slot=navigation-menu-link]:focus:ring-0',
                className,
            )}
            {...props}
        />
    );
}

function NavigationMenuViewport({
    className,
    ...props
}: NavigationMenuPrimitive.Viewport.Props) {
    return (
        <NavigationMenuPrimitive.Portal>
            <NavigationMenuPrimitive.Positioner
                data-slot="navigation-menu-positioner"
                sideOffset={6}
                className="isolate z-50"
            >
                <NavigationMenuPrimitive.Popup
                    data-slot="navigation-menu-popup"
                    // Base UI drives the size through these vars; transitioning them is what
                    // makes moving between triggers resize instead of jump.
                    className="data-closed:fade-out-0 data-open:fade-in-0 relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-md border bg-popover text-popover-foreground shadow transition-[width,height] duration-200 data-closed:animate-out data-open:animate-in"
                >
                    <NavigationMenuPrimitive.Viewport
                        data-slot="navigation-menu-viewport"
                        className={cn('relative', className)}
                        {...props}
                    />
                </NavigationMenuPrimitive.Popup>
            </NavigationMenuPrimitive.Positioner>
        </NavigationMenuPrimitive.Portal>
    );
}

function NavigationMenuLink({
    className,
    ...props
}: NavigationMenuPrimitive.Link.Props) {
    return (
        <NavigationMenuPrimitive.Link
            data-slot="navigation-menu-link"
            className={cn(
                "flex flex-col gap-1 rounded-sm p-2 text-sm outline-none transition-all hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground data-[active=true]:focus:bg-accent data-[active=true]:hover:bg-accent [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
                className,
            )}
            {...props}
        />
    );
}

export {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
    navigationMenuTriggerStyle,
};
