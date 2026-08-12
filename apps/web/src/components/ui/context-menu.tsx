import type * as React from 'react';

import { ContextMenu as ContextMenuPrimitive } from '@base-ui/react/context-menu';
import { Menu as MenuPrimitive } from '@base-ui/react/menu';
import { Check, ChevronRight, Circle } from 'lucide-react';

import { cn } from '@/utils/cn';

const ContextMenu = ContextMenuPrimitive.Root;

const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

const ContextMenuGroup = MenuPrimitive.Group;

const ContextMenuPortal = ContextMenuPrimitive.Portal;

const ContextMenuSub = MenuPrimitive.SubmenuRoot;

const ContextMenuRadioGroup = MenuPrimitive.RadioGroup;

function ContextMenuSubTrigger({
    className,
    inset,
    children,
    ...props
}: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
    return (
        <MenuPrimitive.SubmenuTrigger
            data-slot="context-menu-sub-trigger"
            className={cn(
                'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden data-highlighted:bg-muted data-highlighted:text-accent-foreground data-popup-open:bg-muted data-popup-open:text-accent-foreground',
                inset && 'pl-8',
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRight className="ml-auto size-4" />
        </MenuPrimitive.SubmenuTrigger>
    );
}

function ContextMenuSubContent({
    className,
    ...props
}: MenuPrimitive.Popup.Props) {
    return (
        <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.Positioner className="isolate z-50">
                <ContextMenuPrimitive.Popup
                    data-slot="context-menu-sub-content"
                    className={cn(
                        'z-50 min-w-32 origin-(--transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition-[opacity,scale,translate] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 data-[side=bottom]:data-starting-style:-translate-y-1 data-[side=bottom]:data-ending-style:-translate-y-1 data-[side=top]:data-starting-style:translate-y-1 data-[side=top]:data-ending-style:translate-y-1 data-[side=left]:data-starting-style:translate-x-1 data-[side=left]:data-ending-style:translate-x-1 data-[side=right]:data-starting-style:-translate-x-1 data-[side=right]:data-ending-style:-translate-x-1',
                        className,
                    )}
                    {...props}
                />
            </ContextMenuPrimitive.Positioner>
        </ContextMenuPrimitive.Portal>
    );
}

function ContextMenuContent({
    className,
    ...props
}: ContextMenuPrimitive.Popup.Props) {
    return (
        <ContextMenuPrimitive.Portal>
            <ContextMenuPrimitive.Positioner className="isolate z-50">
                <ContextMenuPrimitive.Popup
                    data-slot="context-menu-content"
                    className={cn(
                        'z-50 min-w-32 origin-(--transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition-[opacity,scale,translate] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 data-[side=bottom]:data-starting-style:-translate-y-1 data-[side=bottom]:data-ending-style:-translate-y-1 data-[side=top]:data-starting-style:translate-y-1 data-[side=top]:data-ending-style:translate-y-1 data-[side=left]:data-starting-style:translate-x-1 data-[side=left]:data-ending-style:translate-x-1 data-[side=right]:data-starting-style:-translate-x-1 data-[side=right]:data-ending-style:-translate-x-1',
                        className,
                    )}
                    {...props}
                />
            </ContextMenuPrimitive.Positioner>
        </ContextMenuPrimitive.Portal>
    );
}

function ContextMenuItem({
    className,
    inset,
    ...props
}: MenuPrimitive.Item.Props & { inset?: boolean }) {
    return (
        <MenuPrimitive.Item
            data-slot="context-menu-item"
            className={cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-highlighted:bg-muted data-highlighted:text-accent-foreground data-disabled:opacity-50',
                inset && 'pl-8',
                className,
            )}
            {...props}
        />
    );
}

function ContextMenuCheckboxItem({
    className,
    children,
    checked,
    ...props
}: MenuPrimitive.CheckboxItem.Props) {
    return (
        <MenuPrimitive.CheckboxItem
            data-slot="context-menu-checkbox-item"
            className={cn(
                'relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden data-disabled:pointer-events-none data-highlighted:bg-muted data-highlighted:text-accent-foreground data-disabled:opacity-50',
                className,
            )}
            checked={checked}
            {...props}
        >
            <span className="absolute left-2 flex size-3.5 items-center justify-center">
                <MenuPrimitive.CheckboxItemIndicator>
                    <Check className="size-4" />
                </MenuPrimitive.CheckboxItemIndicator>
            </span>
            {children}
        </MenuPrimitive.CheckboxItem>
    );
}

function ContextMenuRadioItem({
    className,
    children,
    ...props
}: MenuPrimitive.RadioItem.Props) {
    return (
        <MenuPrimitive.RadioItem
            data-slot="context-menu-radio-item"
            className={cn(
                'relative flex cursor-default select-none items-center rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden data-disabled:pointer-events-none data-highlighted:bg-muted data-highlighted:text-accent-foreground data-disabled:opacity-50',
                className,
            )}
            {...props}
        >
            <span className="absolute left-2 flex size-3.5 items-center justify-center">
                <MenuPrimitive.RadioItemIndicator>
                    <Circle className="size-2 fill-current" />
                </MenuPrimitive.RadioItemIndicator>
            </span>
            {children}
        </MenuPrimitive.RadioItem>
    );
}

function ContextMenuLabel({
    className,
    inset,
    ...props
}: MenuPrimitive.GroupLabel.Props & { inset?: boolean }) {
    return (
        <MenuPrimitive.GroupLabel
            data-slot="context-menu-label"
            className={cn(
                'px-2 py-1.5 font-semibold text-foreground text-sm',
                inset && 'pl-8',
                className,
            )}
            {...props}
        />
    );
}

function ContextMenuSeparator({
    className,
    ...props
}: MenuPrimitive.Separator.Props) {
    return (
        <MenuPrimitive.Separator
            data-slot="context-menu-separator"
            className={cn('-mx-1 my-1 h-px bg-border', className)}
            {...props}
        />
    );
}

function ContextMenuShortcut({
    className,
    ...props
}: React.ComponentProps<'span'>) {
    return (
        <span
            data-slot="context-menu-shortcut"
            className={cn(
                'ml-auto text-muted-foreground text-xs tracking-widest',
                className,
            )}
            {...props}
        />
    );
}

export {
    ContextMenu,
    ContextMenuCheckboxItem,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuPortal,
    ContextMenuRadioGroup,
    ContextMenuRadioItem,
    ContextMenuSeparator,
    ContextMenuShortcut,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
};
