import React from 'react'

const getBorder = (theme: 'primary' | 'primary-stroke' | 'gray-stroke') => {
    switch (theme) {
    case 'primary':
    case 'primary-stroke':
        return '1px solid #3A7BBF'
    case 'gray-stroke':
        return '1px solid #C9CDD2'
    }
}

export const Button: React.FC<{
    text: string,
    onClick: Function,
    theme: 'primary' | 'primary-stroke' | 'gray-stroke',
    fontSize?: number
    style?: any,
    border?: string,
}> = (props) => {
    const customStyle = props.style || {}
    return <div
        className={'button' + ' ' + props.theme}
        style={{
            border: props.border || getBorder(props.theme),
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
