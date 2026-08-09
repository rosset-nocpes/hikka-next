import type { PlateElementProps } from 'platejs/react';
import { PlateElement } from 'platejs/react';

export function SpoilerInlineElement(props: PlateElementProps) {
    return (
        <PlateElement
            as="span"
            className="spoiler-inline rounded-sm bg-secondary/60 px-0.5 underline decoration-muted-foreground decoration-dotted underline-offset-4"
            {...props}
        >
            {props.children}
        </PlateElement>
    );
}
