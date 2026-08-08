import { MentionInputPlugin, MentionPlugin } from '@platejs/mention/react';

import {
    MentionElement,
    MentionInputElement,
} from '@/components/plate/ui/mention-node';

export const MentionKit = [
    // No `insertSpaceAfterMention`: it only fires when the mention ends the
    // block, and remark-stringify writes that trailing space as `&#x20;`.
    MentionPlugin.configure({
        options: { triggerPreviousCharPattern: /^$|^[\s"']$/ },
    }).withComponent(MentionElement),
    MentionInputPlugin.withComponent(MentionInputElement),
];
