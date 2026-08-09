import {
    type TriggerComboboxPluginOptions,
    withTriggerCombobox,
} from '@platejs/combobox';
import {
    createSlatePlugin,
    createTSlatePlugin,
    type PluginConfig,
} from 'platejs';
import { toPlatePlugin } from 'platejs/react';

import { ContentSearchInputElement } from '@/components/plate/ui/content-search-node';

export const CONTENT_SEARCH_KEY = 'content_search';
export const CONTENT_SEARCH_INPUT_KEY = 'content_search_input';

const BaseContentSearchInputPlugin = createSlatePlugin({
    key: CONTENT_SEARCH_INPUT_KEY,
    node: { isElement: true, isInline: true, isVoid: true },
});

// The picker inserts a plain link, so this plugin owns no node of its own —
// `createComboboxInput` is what `withTriggerCombobox` inserts on trigger.
const BaseContentSearchPlugin = createTSlatePlugin<
    PluginConfig<'content_search', TriggerComboboxPluginOptions>
>({
    key: CONTENT_SEARCH_KEY,
    options: {
        trigger: '#',
        triggerPreviousCharPattern: /^$|^[\s"']$/,
        createComboboxInput: (trigger) => ({
            children: [{ text: '' }],
            trigger,
            type: CONTENT_SEARCH_INPUT_KEY,
        }),
    },
    plugins: [BaseContentSearchInputPlugin],
}).overrideEditor(withTriggerCombobox);

export const ContentSearchKit = [
    toPlatePlugin(BaseContentSearchPlugin),
    toPlatePlugin(BaseContentSearchInputPlugin).withComponent(
        ContentSearchInputElement,
    ),
];
