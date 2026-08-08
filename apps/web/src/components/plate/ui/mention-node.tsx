import * as React from 'react';

import { getMentionOnSelectItem } from '@platejs/mention';
import { useQuery } from '@tanstack/react-query';
import { IS_APPLE, type TElement } from 'platejs';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement, useFocused, useSelected } from 'platejs/react';

import { searchUsersOptions } from '@hikka/api';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useDebounce from '@/services/hooks/use-debounce';
import { cn } from '@/utils/cn';

import {
    InlineCombobox,
    InlineComboboxContent,
    InlineComboboxEmpty,
    InlineComboboxGroup,
    InlineComboboxInput,
    InlineComboboxItem,
} from './inline-combobox';

export type TMentionElement = TElement & {
    value: string;
    key?: string;
};

const MIN_SEARCH_LENGTH = 2;

export function MentionElement(props: PlateElementProps<TMentionElement>) {
    const selected = useSelected();
    const focused = useFocused();
    const label = `@${props.element.value}`;

    return (
        <PlateElement
            {...props}
            as="span"
            className={cn(
                // ring, not border: a border would grow every line that holds a mention
                'inline-block whitespace-nowrap rounded-sm bg-primary px-1 align-baseline font-medium text-primary-foreground ring-1 ring-primary-border ring-inset',
                selected && focused && 'ring-2 ring-ring',
            )}
            attributes={{
                ...props.attributes,
                contentEditable: false,
                'data-slate-value': props.element.value,
            }}
        >
            {IS_APPLE ? (
                <React.Fragment>
                    {props.children}
                    {label}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    {label}
                    {props.children}
                </React.Fragment>
            )}
        </PlateElement>
    );
}

const onSelectItem = getMentionOnSelectItem();

export function MentionInputElement(props: PlateElementProps) {
    const { children, editor, element } = props;
    const [search, setSearch] = React.useState('');
    const [debouncedSearch] = useDebounce({ value: search, delay: 300 });

    const isTooShort = debouncedSearch.trim().length < MIN_SEARCH_LENGTH;
    const isPending = search !== debouncedSearch;

    const { data: users, isFetching } = useQuery({
        ...searchUsersOptions({ body: { query: debouncedSearch } }),
        enabled: !isTooShort,
    });

    const mentionable = users?.filter((user) => user.username);

    return (
        <PlateElement as="span" {...props}>
            <InlineCombobox
                value={search}
                element={element}
                filter={false}
                setValue={setSearch}
                trigger="@"
                hideWhenNoValue
            >
                <InlineComboboxInput />

                <InlineComboboxContent>
                    <InlineComboboxEmpty>
                        {isTooShort
                            ? 'Введіть щонайменше 2 символи'
                            : isFetching || isPending
                              ? 'Завантаження...'
                              : 'Користувачів не знайдено'}
                    </InlineComboboxEmpty>

                    <InlineComboboxGroup>
                        {mentionable?.map((user) => (
                            <InlineComboboxItem
                                key={user.reference}
                                value={user.username ?? ''}
                                onClick={() =>
                                    onSelectItem(
                                        editor,
                                        {
                                            key: user.reference,
                                            text: user.username ?? '',
                                        },
                                        search,
                                    )
                                }
                            >
                                <Avatar className="size-5">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>
                                        {user.username?.[0]}
                                    </AvatarFallback>
                                </Avatar>
                                {user.username}
                            </InlineComboboxItem>
                        ))}
                    </InlineComboboxGroup>
                </InlineComboboxContent>
            </InlineCombobox>

            {children}
        </PlateElement>
    );
}
