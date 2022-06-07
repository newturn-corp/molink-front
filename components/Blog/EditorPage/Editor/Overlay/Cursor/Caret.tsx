import React, { CSSProperties } from 'react'
import {
    CaretPosition
} from '@slate-yjs/react'
import { CursorData } from './RemoteSelection'

type CaretProps = {
    position: CaretPosition;
    data: CursorData;
};

export const Caret = ({ position, data }: CaretProps) => {
    const caretStyle: CSSProperties = {
        ...position,
        background: data.color,
        position: 'absolute'
    }

    const labelStyle: CSSProperties = {
        transform: 'translateY(-100%)',
        background: data.color
    }

    return (
        <div
            style={caretStyle}
            className="caret"
        >
            <div
                className="label"
                style={labelStyle}
            >
                {data.name}
            </div>
        </div>
    )
}
