'use client';

import * as React from 'react';
import BaseCard from '@/app/_components/BaseCard';
import { MEDIA_TYPE, RELEASE_STATUS } from '@/utils/constants';
import Link from "next/link";

interface Props {
    anime: Hikka.Anime;
    onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const Component = ({ anime, onClick }: Props) => {
    return (
        <Link href={'/anime/' + anime.slug} onClick={onClick} className="w-full flex gap-4 px-8 py-4 hover:bg-secondary/60 hover:cursor-pointer">
            <div className="w-20">
                <BaseCard poster={anime.poster} />
            </div>
            <div className="w-full flex flex-col gap-2">
                <h5>
                    {anime.title_ua || anime.title_en}{' '}
                    <span className="text-gray-400">
                                / {anime.title_ja}
                            </span>
                </h5>
                <div className="flex flex-col gap-1">
                    <div className="flex gap-4 items-center">
                        <div className="flex gap-2">
                            <p className="text-gray-400 text-sm">
                                Тип:
                            </p>
                            <p className="text-sm">
                                {MEDIA_TYPE[anime.media_type].title_ua}
                            </p>
                        </div>
                        <div
                            className="rounded-md px-2 text-sm w-fit"
                            style={{
                                backgroundColor:
                                RELEASE_STATUS[anime.status].color,
                            }}
                        >
                            <p>
                                {RELEASE_STATUS[anime.status].title_ua}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <p className="text-gray-400 text-sm">Оцінка:</p>
                        <p className="text-sm">{anime.score}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Component;