import type * as React from 'react';

import { cn } from '@/utils/cn';

function AspectRatio({
    ratio = 1,
    className,
    style,
    ...props
}: React.ComponentProps<'div'> & { ratio?: number }) {
    return (
        <div
            data-slot="aspect-ratio"
            style={{ aspectRatio: ratio, ...style }}
            className={cn('relative', className)}
            {...props}
        />
    );
}

export { AspectRatio };
