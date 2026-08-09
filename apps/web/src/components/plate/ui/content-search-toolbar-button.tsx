import * as React from 'react';

import { createLinkNode } from '@platejs/link';
import { SearchIcon } from 'lucide-react';
import { useEditorRef } from 'platejs/react';

import { ContentTypeEnum, type UserResponse } from '@hikka/api';

import { useSessionUI } from '@/features/auth/hooks/use-session-ui';
import { SearchModal } from '@/features/search';
import type { SearchContent } from '@/features/search/search-modal/types';
import { CONTENT_TYPE_LINKS } from '@/utils/constants/navigation';
import { getTitle } from '@/utils/title/get-title';
import { getSiteUrl } from '@/utils/url';

import { restoreSelection } from '../editor/transforms';
import { ToolbarButton } from './toolbar';

export const CONTENT_SEARCH_LABEL = 'Пошук контенту';

const SEARCHABLE_TYPES = [
    ContentTypeEnum.ANIME,
    ContentTypeEnum.MANGA,
    ContentTypeEnum.NOVEL,
    ContentTypeEnum.CHARACTER,
    ContentTypeEnum.PERSON,
];

export function useContentSearchModal() {
    const editor = useEditorRef();
    const { preferences } = useSessionUI();
    const [open, setOpen] = React.useState(false);

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

    const modal = (
        <SearchModal
            open={open}
            onOpenChange={setOpen}
            allowedTypes={SEARCHABLE_TYPES}
            onClick={insertContentLink}
            type="button"
            disableHotkey
        />
    );

    return { modal, openSearch: () => setOpen(true) };
}

export function ContentSearchToolbarButton() {
    const { modal, openSearch } = useContentSearchModal();

    return (
        <React.Fragment>
            <ToolbarButton onClick={openSearch} tooltip={CONTENT_SEARCH_LABEL}>
                <SearchIcon />
            </ToolbarButton>

            {modal}
        </React.Fragment>
    );
}
