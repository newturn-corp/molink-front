import React, { CSSProperties } from 'react'

export const AuthTitle: React.FC<{
    text: string
    style?: CSSProperties
}> = (props) => {
    return <div
        className={'title'}
        dangerouslySetInnerHTML={{
            __html: props.text
        }}
        {...props}
    />
}
