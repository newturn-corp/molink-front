import React from 'react'

export const SlateBookmarkImageContainer: React.FC<{
    imageUrl: string | null
}> = ({ imageUrl }) => {
    if (!imageUrl) {
        return <></>
    }

    return <div
        className={'image-container'}
    >
        <div
            style={{
                position: 'absolute',
                inset: 0
            }}
        >
            <img
                className={'image'}
                src={imageUrl}
            />
        </div>
    </div>
}
