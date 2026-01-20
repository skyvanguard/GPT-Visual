import React, { useEffect, useReducer } from 'react';
import { useProgramState } from '../Sidebar';
import { BlockTooltip } from './BlockTooltip';

export const BlockTooltipOverlay: React.FC = () => {
    const progState = useProgramState();
    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        // Subscribe to HTML updates to re-render when hover state changes
        const unsubscribe = progState.htmlSubs.subscribe(() => {
            forceUpdate();
        });
        return unsubscribe;
    }, [progState.htmlSubs]);

    return (
        <BlockTooltip
            hoverTarget={progState.display.hoverTarget}
            mousePos={progState.mouse.mousePos}
            layout={progState.layout}
        />
    );
};
