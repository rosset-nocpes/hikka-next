import * as React from 'react';

import { useRender } from '@base-ui/react/use-render';

type Params<T extends React.ElementType> = {
    asChild?: boolean;
    children?: React.ReactNode;
    element: T;
    props: Record<string, unknown>;
    ref?: React.Ref<Element>;
};

/**
 * Base UI takes a `render` element where Radix took an `asChild` child. Wrappers keep
 * exposing `asChild` so the call sites outside `components/ui/` stay untouched.
 */
export function useAsChild<T extends React.ElementType>({
    asChild,
    children,
    element,
    props,
    ref,
}: Params<T>) {
    const child = asChild && React.isValidElement(children) ? children : null;

    return useRender({
        render: child ?? React.createElement(element as React.ElementType),
        ref,
        props: child ? props : { ...props, children },
    });
}
