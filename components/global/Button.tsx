import React from 'react'

export const Button: React.FC<{
    text: string,
    onClick: Function,
    theme: 'primary' | 'primary-stroke',
    fontSize?: number
    style?: any,
    border?: string,
}> = (props) => {
    const customStyle = props.style || {}
    return <div
        className={'button' + ' ' + props.theme}
        style={{
            border: props.border || '1px solid #3A7BBF',
            ...customStyle
        }}
        onClick={() => props.onClick()}
    >
        <div
            className={'text'}
            style={{
                fontSize: props.fontSize
            }}
        >
            {props.text}
        </div>
    </div>
}
