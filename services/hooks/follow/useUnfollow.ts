import { useMutation, useQueryClient } from '@tanstack/react-query';

import unfollow from '@/services/api/follow/unfollow';
import { useAuthContext } from '@/services/providers/auth-provider';

const useUnfollow = ({ username }: { username: string }) => {
    const { secret } = useAuthContext();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ['unfollow', username, { secret }],
        mutationFn: () =>
            unfollow({
                secret: String(secret),
                username: String(username),
            }),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
        },
    });
};

export default useUnfollow;