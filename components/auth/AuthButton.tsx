import React, { CSSProperties } from 'react'

export const AuthButton: React.FC<{
    text: string,
    onClick: Function,
    theme: 'primary' | 'primary-stroke',
    style?: CSSProperties,
    border?: string,
    textStyle?: CSSProperties
}> = ({
    text,
    onClick,
    border,
    style,
    theme,
    textStyle
}) => {
    const customStyle = style || {}
    const customTextStyle = textStyle || {}
    return <div
        className={'auth-button' + ' ' + theme}
        style={{
            border: border || '1px solid #3A7BBF',
            ...customStyle
        }}
        onClick={() => onClick()}
    >
        <div
            className={'text'}
            style={{
                ...textStyle
            }}
        >
            {text}
        </div>
    </div>
}
