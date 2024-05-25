'use client';

import { formatDistance } from 'date-fns';
import Link from 'next/link';
import React, { FC } from 'react';

import P from '@/components/typography/p';
import Small from '@/components/typography/small';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';

import useSeenNotification from '@/services/hooks/notifications/useSeenNotification';

interface Props {
    data: Hikka.TextNotification;
}

const NotificationItem: FC<Props> = ({ data }) => {
    const { mutate: asSeen } = useSeenNotification();

    const handleOnClick = () => {
        if (!data.seen) {
            asSeen({
                reference: data.reference,
            });
        }
    };

    return (
        <DropdownMenuItem className="flex items-center gap-4 py-3" asChild>
            <Link href={data.href} prefetch onClick={handleOnClick}>
                <div className="relative rounded-md bg-muted p-2 text-muted-foreground">
                    {data.icon}
                    {!data.seen && (
                        <div className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-secondary/60 bg-warning" />
                    )}
                </div>
                <div className="flex flex-1 flex-col gap-2">
                    <div className="inline-flex items-center gap-2">
                        <Label className="line-clamp-1 w-fit leading-normal">
                            {data.title}
                        </Label>
                    </div>
                    <P className="text-xs text-muted-foreground">
                        {data.description}
                    </P>
                    <Small className="text-muted-foreground opacity-60">
                        {formatDistance(data.created * 1000, Date.now(), {
                            addSuffix: true,
                        })}
                    </Small>
                </div>
                {data.poster && data.poster}
            </Link>
        </DropdownMenuItem>
    );
};

export default NotificationItem;