import React from 'react'

export const AuthButton: React.FC<{
    text: string,
    backgroundColor: string,
    textColor: string,
    onClick: Function,
    style?: any,
    border?: string,
}> = ({ text, backgroundColor, textColor, onClick, border, style }) => {
    const customStyle = style || {}
    return <div
        className={'auth-button'}
        style={{
            backgroundColor,
            border: border || '1px solid #3A7BBF',
            ...customStyle
        }}
        onClick={() => onClick()}
    >
        <div
            className={'text'}
            style={{
                color: textColor
            }}
        >
            {text}
        </div>
    </div>
}
