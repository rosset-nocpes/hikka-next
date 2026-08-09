import * as React from 'react';

import { createLinkNode } from '@platejs/link';
import {
    ListIcon,
    ListOrderedIcon,
    MoreHorizontalIcon,
    QuoteIcon,
    SearchIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorRef } from 'platejs/react';

import { ContentTypeEnum, type UserResponse } from '@hikka/api';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { SearchModal } from '@/features/search';
import type { SearchContent } from '@/features/search/search-modal/types';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { getTitle } from '@/utils/title/get-title';
import { getSiteUrl } from '@/utils/url';

import { insertBlock, restoreSelection } from '../editor/transforms';
import { ToolbarButton } from './toolbar';

const SEARCHABLE_TYPES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
    ContentTypeEnum.CHARACTER,
    ContentTypeEnum.PERSON,
];

export function OverflowToolbarButton() {
    const editor = useEditorRef();
    const { preferences } = useSessionUI();
    const [open, setOpen] = React.useState(false);
    const [searchOpen, setSearchOpen] = React.useState(false);

    const insert = (type: string) => {
        insertBlock(editor, type);
        editor.tf.focus();
    };

    const insertContentLink = (content: SearchContent | UserResponse) => {
        if (!('slug' in content)) return;

        const path = CONTENT_TYPE_LINKS[content.data_type as ContentTypeEnum];

        if (!path) return;

        restoreSelection(editor);

        editor.tf.insertNodes(
            createLinkNode(editor, {
                url: `${getSiteUrl()}${path}/${content.slug}`,
                text: getTitle(
                    content,
                    preferences?.title_language ?? 'title_ua',
                    preferences?.name_language ?? 'name_ua',
                ),
            }),
        );
        editor.tf.focus();
    };

    return (
        <React.Fragment>
            <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
                <DropdownMenuTrigger asChild>
                    <ToolbarButton pressed={open} tooltip="Більше" isDropdown>
                        <MoreHorizontalIcon />
                    </ToolbarButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onSelect={() => insert(KEYS.blockquote)}>
                        <QuoteIcon />
                        Цитата
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => insert(KEYS.ulClassic)}>
                        <ListIcon />
                        Маркований список
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => insert(KEYS.olClassic)}>
                        <ListOrderedIcon />
                        Нумерований список
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setSearchOpen(true)}>
                        <SearchIcon />
                        Пошук контенту
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SearchModal
                open={searchOpen}
                onOpenChange={setSearchOpen}
                allowedTypes={SEARCHABLE_TYPES}
                onClick={insertContentLink}
                type="button"
                disableHotkey
            />
        </React.Fragment>
    );
}
