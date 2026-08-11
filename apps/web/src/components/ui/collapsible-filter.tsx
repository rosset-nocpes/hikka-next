import type { FC, ReactNode } from 'react';

import MaterialSymbolsKeyboardArrowDownRounded from '@/components/icons/material-symbols/MaterialSymbolsKeyboardArrowDownRounded';
import MaterialSymbolsKeyboardArrowUpRounded from '@/components/icons/material-symbols/MaterialSymbolsKeyboardArrowUpRounded';
import { Button } from '@/components/ui/button';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Label } from '@/components/ui/label';
import { cn } from '@/utils/cn';

export type CollapsibleFilterProps = React.ComponentProps<
    typeof Collapsible
> & {
    active?: boolean;
    icon?: ReactNode;
};

export const CollapsibleFilter: FC<CollapsibleFilterProps> = ({
    title,
    children,
    className,
    active,
    icon,
    ...props
}) => {
    return (
        <Collapsible
            defaultOpen={active}
            className={cn(
                'group border border-border surface py-2 duration-200 data-open:mb-4 data-open:rounded-lg data-open:py-4',
                'data-open:[&+div]:data-closed:rounded-t-lg',
                'data-closed:border-b-0 data-closed:has-[+div[data-open]]:mb-4 data-closed:has-[+div[data-open]]:rounded-b-lg data-closed:has-[+div[data-open]]:border-b',
                'first:rounded-t-lg last:rounded-b-lg last:border-b!',
            )}
            {...props}
        >
            <CollapsibleTrigger
                render={
                    <div className="flex cursor-pointer items-center justify-between gap-2 px-4" />
                }
            >
                <div className="flex items-center gap-2">
                    {icon && icon}
                    <Label className="cursor-pointer select-none">
                        {title}
                    </Label>
                    {active && (
                        <div className="size-2 rounded-full bg-success-foreground" />
                    )}
                </div>
                <Button id="title-collapse" variant="ghost" size="icon-sm">
                    <MaterialSymbolsKeyboardArrowUpRounded className="size-4 group-data-closed:hidden" />
                    <MaterialSymbolsKeyboardArrowDownRounded className="size-4 group-data-open:hidden" />
                </Button>
            </CollapsibleTrigger>

            <CollapsibleContent
                className={cn(
                    'w-full overflow-hidden px-4 data-closed:animate-collapsible-up data-open:animate-collapsible-down',
                    className,
                )}
            >
                <div className="mt-4 space-y-4">{children}</div>
            </CollapsibleContent>
        </Collapsible>
    );
};
