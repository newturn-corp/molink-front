import React, { MouseEventHandler, ReactNode } from 'react'
import { observer } from 'mobx-react'

export interface ContentControlButtonProps {
    icon: ReactNode
    onClick: MouseEventHandler<HTMLDivElement>
    color: string
}

export const ContentControlButton
    : React.FC<ContentControlButtonProps> = observer((props) => {
        return <div
            className='button'
            onClick={(event) => props.onClick(event)}
            style={{
                fill: props.color
            }}
        >
            {props.icon}
        </div>
    })
