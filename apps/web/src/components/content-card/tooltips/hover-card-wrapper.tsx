import {
    type FC,
    type PropsWithChildren,
    type ReactElement,
    type ReactNode,
    useEffect,
    useState,
} from 'react';

import {
    HoverCard,
    HoverCardArrow,
    HoverCardContent,
    HoverCardPortal,
    HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn } from '@/utils/cn';

import { useTooltipSuppressed } from './tooltip-suppress-context';

type Props = PropsWithChildren & {
    content: ReactNode;
    size?: 'md' | 'auto';
};

const HoverCardWrapper: FC<Props> = ({ children, content, size = 'md' }) => {
    const suppressed = useTooltipSuppressed();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (suppressed) setOpen(false);
    }, [suppressed]);

    return (
        <HoverCard open={suppressed ? false : open} onOpenChange={setOpen}>
            <HoverCardTrigger
                delay={500}
                closeDelay={100}
                render={children as ReactElement}
            />
            <HoverCardContent
                side="right"
                className={cn(
                    'hidden flex-col gap-4 md:flex',
                    size === 'md' && 'w-80',
                    size === 'auto' && 'min-w-min',
                )}
            >
                <HoverCardArrow />
                {content}
            </HoverCardContent>
        </HoverCard>
    );
};

export default HoverCardWrapper;
