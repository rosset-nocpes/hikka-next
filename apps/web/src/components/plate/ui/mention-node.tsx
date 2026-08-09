import * as React from 'react';

import { getMentionOnSelectItem } from '@platejs/mention';
import { useQuery } from '@tanstack/react-query';
import { IS_APPLE, type TElement } from 'platejs';
import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

import { searchUsersOptions } from '@hikka/api';

import {
    MENTION_CLASSNAME,
    useMentionUser,
} from '@/components/markdown/viewer/components/mention';
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
    const { key, value } = props.element;
    const user = useMentionUser(value, key);

    const content = (
        <React.Fragment>
            <Avatar className="size-5 self-center">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{value[0]}</AvatarFallback>
            </Avatar>
            @{value}
        </React.Fragment>
    );

    return (
        <PlateElement
            {...props}
            as="span"
            className={cn(MENTION_CLASSNAME, 'whitespace-nowrap')}
            attributes={{
                ...props.attributes,
                contentEditable: false,
                'data-slate-value': value,
            }}
        >
            {IS_APPLE ? (
                <React.Fragment>
                    {props.children}
                    {content}
                </React.Fragment>
            ) : (
                <React.Fragment>
                    {content}
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
