import { FetchRequestProps, fetchRequest } from '@/services/api/fetchRequest';

export interface Response {
    unseen: number;
}

export default async function req(
    props?: FetchRequestProps,
): Promise<Response> {
    return fetchRequest<Response>({
        ...props,
        path: `/notifications/count`,
        method: 'get',
    });
}
