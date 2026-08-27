import MaterialSymbolsFormatQuoteRounded from '@/components/icons/material-symbols/MaterialSymbolsFormatQuoteRounded';
import MDViewer from '@/components/markdown/viewer/md-viewer';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Card from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { AboutTeamMember } from '@/utils/constants/about-data';
import { Link } from '@/utils/navigation';
import { UserReferenceResponse } from '@hikka/api';
import { LinkIcon } from 'lucide-react';

function TeamMemberCard({
    member,
    profile,
    className,
}: {
    member: AboutTeamMember;
    profile: UserReferenceResponse;
    className?: string;
}) {
    const username = profile.username ?? member.reference;

    if ('memorial' in member) {
        return (
            <Card
                className={cn(
                    'overflow-hidden flex-row items-center',
                    className,
                )}
            >
                <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-br from-blue-500/[0.07] via-transparent to-yellow-400/[0.07]"
                />

                <Link to={`/u/${profile.username}`}>
                    <Avatar className="size-20 rounded-md sm:size-24">
                        <AvatarImage
                            src={profile.avatar}
                            alt={`Аватар ${username}`}
                        />
                    </Avatar>
                </Link>

                <div className="min-w-0 flex-1">
                    <div className="mb-1.5 flex items-center text-amber-500 dark:text-amber-400">
                        <span className="font-semibold text-xs tracking-wide">
                            {member.role}
                        </span>
                    </div>
                    <Link to={`/u/${username}`} className="flex w-fit">
                        <h3 className="truncate hover:underline">{username}</h3>
                    </Link>
                    <p className="mt-1 max-w-3xl text-pretty text-muted-foreground text-sm leading-relaxed">
                        {member.memorial}
                    </p>
                </div>
            </Card>
        );
    }

    const quote =
        'quoteFromProfile' in member && member.quoteFromProfile
            ? profile.description
            : null;

    return (
        <Card className={cn('gap-0 overflow-hidden p-0', className)}>
            <div className="flex min-w-0 gap-4 p-4">
                <Link to={`/u/${profile.username}`}>
                    <Avatar className="size-20 rounded-md sm:size-24">
                        <AvatarImage
                            src={profile.avatar}
                            alt={`Аватар ${username}`}
                        />
                    </Avatar>
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                    <div>
                        <Link to={`/u/${username}`} className="flex w-fit">
                            <h3 className="truncate hover:underline">
                                {username}
                            </h3>
                        </Link>
                        <p className="text-pretty text-muted-foreground text-sm">
                            {member.role}
                        </p>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-3">
                        {member.links.map((link) => (
                            <Button
                                key={link.href}
                                variant="ghost"
                                size="sm"
                                className="text-primary-foreground hover:text-primary-foreground/80"
                                render={
                                    <Link
                                        to={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    />
                                }
                            >
                                <LinkIcon aria-hidden="true" />
                                {link.title}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {quote && (
                <div className="flex gap-2 text-pretty border-border border-t px-4 py-3.5 text-muted-foreground">
                    <MaterialSymbolsFormatQuoteRounded className="size-5 shrink-0" />
                    <MDViewer className="prose-inline text-sm italic">
                        {quote}
                    </MDViewer>
                </div>
            )}
        </Card>
    );
}

export default TeamMemberCard;
