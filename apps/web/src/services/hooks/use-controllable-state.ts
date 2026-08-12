import * as React from 'react';

type SetStateFn<T> = (prev: T) => T;

type UseControllableStateParams<T> = {
    prop: T | undefined;
    defaultProp: T;
    onChange?: (value: T, ...rest: never[]) => void;
};

/**
 * Reads from `prop` when the caller controls the value and from local state
 * otherwise, calling `onChange` either way.
 */
export function useControllableState<T>({
    prop,
    defaultProp,
    onChange,
}: UseControllableStateParams<T>) {
    const [uncontrolled, setUncontrolled] = React.useState(defaultProp);
    const controlled = prop !== undefined;
    const value = controlled ? prop : uncontrolled;

    const onChangeRef = React.useRef(onChange);
    React.useEffect(() => {
        onChangeRef.current = onChange;
    });

    const valueRef = React.useRef(value);
    valueRef.current = value;

    const setValue = React.useCallback(
        (next: T | SetStateFn<T>) => {
            const resolved =
                typeof next === 'function'
                    ? (next as SetStateFn<T>)(valueRef.current)
                    : next;

            if (Object.is(resolved, valueRef.current)) return;

            if (!controlled) setUncontrolled(resolved);
            onChangeRef.current?.(resolved);
        },
        [controlled],
    );

    return [value, setValue] as const;
}
