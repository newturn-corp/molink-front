import React from 'react'

export const Button: React.FC<{
    text: string,
    onClick: Function,
    theme: 'primary' | 'primary-stroke',
    style?: any,
    border?: string,
}> = ({
    text,
    onClick,
    border,
    style,
    theme
}) => {
    const customStyle = style || {}
    return <div
        className={'button' + ' ' + theme}
        style={{
            border: border || '1px solid #3A7BBF',
            ...customStyle
        }}
        onClick={() => onClick()}
    >
        <div
            className={'text'}
        >
            {text}
        </div>
    </div>
}
