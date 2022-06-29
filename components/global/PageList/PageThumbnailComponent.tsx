import React from 'react'
import { observer } from 'mobx-react'
import Image from 'next/image'

export interface ThumbnailInterface {
    image?: string
    title: string
    thumbnailWidth: number,
    thumbnailHeight: number
}

export const PageThumbnailComponent: React.FC<ThumbnailInterface> = observer((props) => {
    return <div
        className={'thumbnail'}
        style={{
            backgroundColor: props.image ? undefined : '#0094FF',
            padding: props.image ? undefined : 20
        }}
    >
        {
            props.image
                ? <Image
                    src={props.image}
                    width={props.thumbnailWidth}
                    height={props.thumbnailHeight}
                />
                : <div
                    className={'text'}
                >
                    {props.title}
                </div>
        }
    </div>
})
