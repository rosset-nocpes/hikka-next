import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { FC } from 'react';

import P from '@/components/typography/p';
import Header from '@/components/ui/header';

import Applications from '@/features/settings/applications/applications';
import ClientCreateButton from '@/features/settings/applications/client-create-button';

import { prefetchClients } from '@/services/hooks/client/use-clients';
import getQueryClient from '@/utils/get-query-client';

interface Props {
    params: {
        slug: string;
    };
}

const ApplicationsSettingsPage: FC<Props> = async ({ params }) => {
    const queryClient = getQueryClient();

    await prefetchClients();

    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <div className="flex flex-col gap-8">
                <div className="flex flex-col">
                    <Header title="Застосунки">
                        <ClientCreateButton />
                    </Header>
                    <P className="text-sm text-muted-foreground">
                        Підключіть OAuth авторизацію через hikka за допомогою
                        застосунку (для розробників)
                    </P>
                </div>
                <Applications />
            </div>
        </HydrationBoundary>
    );
};

export default ApplicationsSettingsPage;