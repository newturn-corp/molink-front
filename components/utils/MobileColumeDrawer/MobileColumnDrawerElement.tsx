import React, { CSSProperties } from 'react'
import { observer } from 'mobx-react'

export interface MobileColumnDrawerContainerPropsInterface {
    className?: string
    onClick?: React.MouseEventHandler<HTMLDivElement>
    style?: CSSProperties
}

export const MobileColumnDrawerElement: React.FC<MobileColumnDrawerContainerPropsInterface> = observer((props) => {
    return (
        <div
            className={'element' + (props.className ? ' ' + props.className : '')}
            style={{
                ...(props.style || {})
            }}
            onClick={(event) => {
                if (props.onClick) {
                    props.onClick(event)
                }
            }}
        >
            {props.children}
        </div>
    )
})
