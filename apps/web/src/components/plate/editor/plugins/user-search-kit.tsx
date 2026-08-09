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

import { UserSearchInputElement } from '@/components/plate/ui/user-search-node';

export const USER_SEARCH_KEY = 'user_search';
export const USER_SEARCH_INPUT_KEY = 'user_search_input';

const BaseUserSearchInputPlugin = createSlatePlugin({
    key: USER_SEARCH_INPUT_KEY,
    node: { isElement: true, isInline: true, isVoid: true },
});

// Like the content picker, this inserts a plain link and owns no node of its
// own — `createComboboxInput` is what `withTriggerCombobox` inserts on trigger.
const BaseUserSearchPlugin = createTSlatePlugin<
    PluginConfig<'user_search', TriggerComboboxPluginOptions>
>({
    key: USER_SEARCH_KEY,
    options: {
        trigger: '@',
        triggerPreviousCharPattern: /^$|^[\s"']$/,
        createComboboxInput: (trigger) => ({
            children: [{ text: '' }],
            trigger,
            type: USER_SEARCH_INPUT_KEY,
        }),
    },
    plugins: [BaseUserSearchInputPlugin],
}).overrideEditor(withTriggerCombobox);

export const UserSearchKit = [
    toPlatePlugin(BaseUserSearchPlugin),
    toPlatePlugin(BaseUserSearchInputPlugin).withComponent(
        UserSearchInputElement,
    ),
];
