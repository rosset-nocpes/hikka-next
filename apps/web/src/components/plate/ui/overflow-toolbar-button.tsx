import * as React from 'react';

import {
    ListIcon,
    ListOrderedIcon,
    MoreHorizontalIcon,
    QuoteIcon,
    SearchIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { useEditorRef } from 'platejs/react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { insertBlock } from '../editor/transforms';
import {
    CONTENT_SEARCH_LABEL,
    useContentSearchModal,
} from './content-search-toolbar-button';
import { ToolbarButton } from './toolbar';

export function OverflowToolbarButton() {
    const editor = useEditorRef();
    const [open, setOpen] = React.useState(false);
    const { modal, openSearch } = useContentSearchModal();

    const insert = (type: string) => {
        insertBlock(editor, type);
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
                    <DropdownMenuItem onSelect={openSearch}>
                        <SearchIcon />
                        {CONTENT_SEARCH_LABEL}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {modal}
        </React.Fragment>
    );
}
