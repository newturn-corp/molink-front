import React, { CSSProperties, Fragment } from 'react'
import {
    CursorOverlayState
} from '@slate-yjs/react'

import { Caret } from './Caret'

export type CursorData = {
    name: string;
    color: string;
};

export const RemoteSelection = ({
    data,
    selectionRects,
    caretPosition
}: CursorOverlayState<CursorData>) => {
    if (!data) {
        return null
    }

    const selectionStyle: CSSProperties = {
        // Add a opacity to the background color
        backgroundColor: `${data.color}66`
    }

    return <Fragment>
        {selectionRects.map((position, i) => (
            <div
                style={{ ...selectionStyle, ...position }}
                className="remote-selection"
                // eslint-disable-next-line react/no-array-index-key
                key={i}
            />
        ))}
        {caretPosition && <Caret position={caretPosition} data={data} />}
    </Fragment>
}
