import React from 'react'

export const SlateCalloutElement: React.FC<{
    attributes,
    children
}> = ({
    attributes,
    children
}) => {
    return (
        <p
            className='callout'
            spellCheck='false'
            {...attributes}>
            {children}
        </p>
    )
}
