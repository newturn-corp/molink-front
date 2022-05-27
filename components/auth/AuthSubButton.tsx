import React, { CSSProperties } from 'react'

export const AuthSubButton: React.FC<{
    text: string,
    border?: boolean,
    style?: CSSProperties
    onClick: React.MouseEventHandler<HTMLDivElement>
}> = (props) => {
    return <div
        className={'auth-sub-button' + (props.border ? ' border' : '')}
        style={props.style || {}}
        onClick={(event) => props.onClick(event)}
    >
        {props.text}
    </div>
}
