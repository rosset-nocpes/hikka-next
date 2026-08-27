import type { Ref } from 'react';

import { AtSign } from 'lucide-react';

import type { UserReferenceResponse } from '@hikka/api';

import Block from '@/components/ui/block';
import Card from '@/components/ui/card';
import { Header, HeaderContainer, HeaderTitle } from '@/components/ui/header';
import { Link } from '@/utils/navigation';

import { ABOUT_CONTENT } from '@/utils/constants/about-data';
import { Button } from '@/components/ui/button';
import { EXTERNAL_LINKS } from '@/utils/constants/external-links';
import TeamMemberCard from './team-member-card';

type AboutPageProps = {
    profiles: Record<string, UserReferenceResponse>;
    titleAnchor: Ref<HTMLDivElement>;
};

export function AboutPage({ profiles, titleAnchor }: AboutPageProps) {
    return (
        <div className="flex flex-col gap-12">
            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle ref={titleAnchor} variant="h1">
                            Про проєкт
                        </HeaderTitle>
                    </HeaderContainer>
                </Header>

                <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)] lg:items-center">
                    <div className="flex max-w-4xl flex-col gap-3 text-pretty text-base leading-relaxed">
                        {ABOUT_CONTENT.description.map((paragraph) => (
                            <p key={paragraph}>{paragraph}</p>
                        ))}
                    </div>

                    <Card className="grid grid-cols-1 gap-1 p-2 sm:grid-cols-2 lg:grid-cols-2">
                        {Object.entries(EXTERNAL_LINKS).map(
                            ([slug, { href, title, icon: Icon }]) => (
                                <Button
                                    key={slug}
                                    variant="ghost"
                                    size="md"
                                    className="justify-start gap-3"
                                    render={
                                        <Link
                                            to={href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        />
                                    }
                                >
                                    <span className="flex size-6 shrink-0 items-center justify-center rounded-sm text-primary-foreground">
                                        <Icon aria-hidden="true" />
                                    </span>
                                    {title}
                                </Button>
                            ),
                        )}
                    </Card>
                </div>
            </Block>

            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h2">Команда</HeaderTitle>
                    </HeaderContainer>
                </Header>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {ABOUT_CONTENT.team.map((member) => (
                        <TeamMemberCard
                            key={member.reference}
                            member={member}
                            profile={profiles[member.reference]}
                            className={
                                'memorial' in member
                                    ? 'md:col-span-2 xl:col-span-3'
                                    : undefined
                            }
                        />
                    ))}
                </div>
            </Block>

            <Block>
                <Header>
                    <HeaderContainer>
                        <HeaderTitle variant="h2">Окрема подяка</HeaderTitle>
                    </HeaderContainer>
                </Header>

                <div className="flex flex-wrap gap-2">
                    {ABOUT_CONTENT.thanks.map((reference) => {
                        const profile = profiles[reference];
                        const username = profile.username ?? reference;

                        return (
                            <Button
                                key={reference}
                                variant="secondary"
                                size="sm"
                                className="text-muted-foreground rounded-sm px-3"
                                render={<Link to={`/u/${username}`} />}
                            >
                                <AtSign aria-hidden="true" />
                                {username}
                            </Button>
                        );
                    })}
                </div>
            </Block>
        </div>
    );
}
