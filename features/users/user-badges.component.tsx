import { FC, createElement } from 'react';
import MaterialSymbolsSecurity from '~icons/material-symbols/security';
import MaterialSymbolsShieldPerson from '~icons/material-symbols/shield-person';

import P from '@/components/typography/p';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

import { USER_BADGE } from '../../utils/constants';

interface Props {
    user: API.User | undefined;
}

export const UserBadges: FC<Props> = ({ user }) => {
    return (
        <div className="flex gap-0.5 rounded-sm bg-accent/60 p-1 text-xs font-bold text-accent-foreground">
            <Tooltip delayDuration={0}>
                <TooltipTrigger>
                    {user?.role === 'admin' && (
                        <MaterialSymbolsSecurity className="text-[#d0bfff]" />
                    )}
                    {user?.role === 'moderator' && (
                        <MaterialSymbolsShieldPerson className="text-[#ffc9c9]" />
                    )}
                </TooltipTrigger>
                <TooltipContent>
                    <P className="text-sm font-medium">
                        {user?.role === 'admin' ? 'Адміністратор' : 'Модератор'}
                    </P>
                </TooltipContent>
            </Tooltip>
            {user?.badges.map((elem) => (
                <Tooltip key={elem} delayDuration={0}>
                    <TooltipTrigger>
                        {createElement(USER_BADGE[elem].icon!, {
                            className: `${USER_BADGE[elem].color}`,
                        })}
                    </TooltipTrigger>
                    <TooltipContent>
                        <P className="text-sm font-medium">
                            {USER_BADGE[elem].label}
                        </P>
                    </TooltipContent>
                </Tooltip>
            ))}
        </div>
    );
};
