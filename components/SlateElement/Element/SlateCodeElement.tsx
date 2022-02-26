import React from 'react'

export const SlateCodeElement: React.FC<{
    attributes,
    children
}> = ({
    attributes,
    children
}) => {
    return (
        <p
            className='code'
            spellCheck='false'
            {...attributes}>
            {children}
        </p>
    )
}
