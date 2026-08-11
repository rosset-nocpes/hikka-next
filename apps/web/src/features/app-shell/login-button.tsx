import { useRouterState } from '@tanstack/react-router';

import { Button, type ButtonProps } from '@/components/ui/button';
import { Link } from '@/utils/navigation';

const LoginButton = (props: ButtonProps) => {
    const currentUrl = useRouterState({
        select: (s) => {
            const loc = s.resolvedLocation ?? s.location;
            return loc.pathname + loc.searchStr;
        },
    });

    return (
        <Button
            size="md"
            variant="ghost"
            {...props}
            render={<Link to="/login" search={{ callbackUrl: currentUrl }} />}
        >
            Увійти
        </Button>
    );
};

export default LoginButton;
