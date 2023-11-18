import config from '@/utils/api/config';

export interface Response {
    username: string;
    password: string;
    email: string;
}

export default async function req(params: {
    email: string;
    username: string;
    password: string;
}): Promise<Response> {
    const res = await fetch(config.baseAPI + '/auth/signup', {
        method: 'post',
        body: JSON.stringify(params),
        ...config.config,
    });

    if (!res.ok) {
        if (res.status >= 400 && res.status <= 499) {
            throw await res.json();
        }
        throw new Error('Failed to fetch data');
    }

    return await res.json();
}