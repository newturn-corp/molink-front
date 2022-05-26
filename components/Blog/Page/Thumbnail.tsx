import React from 'react'
import { observer } from 'mobx-react'

export interface ThumbnailInterface {
    image?: string
    title: string
}

export const Thumbnail: React.FC<ThumbnailInterface> = observer((props) => {
    return <div
        className={'thumbnail'}
        style={{
            backgroundColor: props.image ? undefined : '#0094FF',
            padding: props.image ? undefined : 20
        }}
    >
        {
            props.image
                ? <img
                    src={props.image}
                />
                : <div
                    className={'text'}
                >
                    {props.title}
                </div>
        }
    </div>
})
