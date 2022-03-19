import React from 'react'

export const AuthSubButton: React.FC<{
    text: string,
    onClick: React.MouseEventHandler<HTMLDivElement>
}> = (props) => {
    return <div
        className={'auth-sub-button'}
        onClick={(event) => props.onClick(event)}
    >
        {props.text}
    </div>
}
