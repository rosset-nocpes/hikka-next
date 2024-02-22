'use client';

import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';

import Link from 'next/link';

import { useLoggedUser } from '@/app/page.hooks';
import AuthModal from '@/components/modals/auth-modal/auth-modal';
import SearchModal from '@/components/modals/search-modal/search-modal';
import { Button } from '@/components/ui/button';
import useIsMobile from '@/services/hooks/useIsMobile';
import useScrollTrigger from '@/services/hooks/useScrollTrigger';
import { useAuthContext } from '@/services/providers/auth-provider';
import { useModalContext } from '@/services/providers/modal-provider';

import NavMenu from './_components/nav-menu';
import ProfileNavbar from './_components/profile-navbar';

interface Props extends PropsWithChildren {}

const Component = ({}: Props) => {
    const isMobile = useIsMobile();
    const { openModal } = useModalContext();

    let { data: loggedUser } = useLoggedUser();

    const trigger = useScrollTrigger({
        threshold: isMobile ? 0 : 40,
        disableHysteresis: true,
    });

    return (
        <nav
            className={clsx(
                'bg-transparent z-10 border-b w-full border-b-secondary/30 transition sticky top-0',
                trigger
                    ? '!border-b-secondary !bg-background'
                    : 'backdrop-blur',
            )}
        >
            <div className="container min-h-16 flex items-center mx-auto max-w-[88rem] gap-4 px-4 md:gap-8">
                <div className="flex items-center flex-1 gap-4 overflow-hidden md:gap-8">
                    <Link href="/" className="h-full w-20">
                        <div className="logo h-[24px] w-[80px] bg-foreground" />
                    </Link>
                    <div
                        className="flex flex-1 items-center gap-4 overflow-hidden"
                        id="breadcrumbs"
                    >
                        <NavMenu />
                    </div>
                </div>
                <div className="flex gap-4">
                    <SearchModal />
                    {loggedUser ? (
                        <ProfileNavbar />
                    ) : (
                        <>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                    openModal({
                                        content: <AuthModal type="login" />,
                                        className: 'p-0 max-w-3xl',
                                    })
                                }
                            >
                                Увійти
                            </Button>
                            <Button
                                size="sm"
                                className="hidden lg:flex"
                                onClick={() =>
                                    openModal({
                                        content: <AuthModal type="signup" />,
                                        className: 'p-0 max-w-3xl',
                                    })
                                }
                            >
                                Реєстрація
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="w-full" id="breadcrumbs-mobile" />
            {/*<div className="w-full container mx-auto max-w-[88rem] px-4" id="subbar" />*/}
        </nav>
    );
};

export default Component;