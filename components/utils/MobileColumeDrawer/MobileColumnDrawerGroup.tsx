import React, { CSSProperties } from 'react'

export interface MobileColumnDrawerGroupPropsInterface {
    style?: CSSProperties
}

export const MobileColumnDrawerGroup: React.FC<MobileColumnDrawerGroupPropsInterface> = (props) => {
    return (
        <div
            className={'group'}
            style={{
                ...(props.style || {})
            }}
        >
            {props.children}
        </div>
    )
}
