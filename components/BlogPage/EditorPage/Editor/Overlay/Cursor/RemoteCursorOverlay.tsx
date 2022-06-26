import React, { PropsWithChildren, useRef } from 'react'
import {
    useRemoteCursorOverlayPositions
} from '@slate-yjs/react'
import { CursorData, RemoteSelection } from './RemoteSelection'
import clsx from 'clsx'

type RemoteCursorsProps = PropsWithChildren<{
    className?: string;
}>

export const RemoteCursorOverlay = ({
    children
}: RemoteCursorsProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const { cursors } = useRemoteCursorOverlayPositions<CursorData>({
        containerRef
    })

    return (
        <div className={'remote-cursor-overlay'} ref={containerRef}>
            {children}
            {cursors.map((cursor) => (
                <RemoteSelection key={cursor.clientId} {...cursor} />
            ))}
        </div>
    )
}
