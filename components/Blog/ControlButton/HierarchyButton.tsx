import React, { ReactNode } from 'react'
import { observer } from 'mobx-react'

export interface HierarchyButtonInterface {
    icon: ReactNode,
    text: string,
    onClick: React.MouseEventHandler<HTMLDivElement>
    disabled?: boolean
}

export const HierarchyButton: React.FC<HierarchyButtonInterface> = observer((props) => {
    return (
        <div
            className={'hierarchy-button' + (props.disabled ? ' disabled' : '')}
            onClick={(event) => props.onClick(event)}
        >
            {props.icon}
            <div className={'text'}>
                {props.text}
            </div>
        </div>
    )
})
