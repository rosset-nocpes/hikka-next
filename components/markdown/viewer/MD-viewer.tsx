'use client';

import React, { memo } from 'react';
import Markdown, { Options } from 'react-markdown';
import remarkDirective from 'remark-directive';
import remarkDirectiveRehype from 'remark-directive-rehype';

import { cn } from '@/utils';

import Spoiler from './_components/spoiler';
import remarkMentions from './plugins/remark-mentions';
import Link from './_components/link';

interface Props extends Options {}

const Component = ({ children, className, ...props }: Props) => {
    return (
        <Markdown
            className={cn('markdown w-full', className)}
            // disallowedElements={['code']}
            remarkPlugins={[
                remarkDirective,
                remarkDirectiveRehype,
                [
                    remarkMentions,
                    { usernameLink: (username: string) => '/u/' + username },
                ],
            ]}
            components={{
                spoiler: Spoiler,
                a: ({ node, children }) => (
                    <Link href={(node?.properties?.href as string) || ''} className="break-all">
                        {children}
                    </Link>
                ),
                code: ({ node, children }) => <p>{children}</p>,
            }}
            {...props}
        >
            {children}
        </Markdown>
    );
};

export default memo(Component);