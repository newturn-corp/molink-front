import React, { MouseEventHandler } from 'react'
import { observer } from 'mobx-react'

export interface ContentHeaderSettingButtonProp {
    onClick: MouseEventHandler<HTMLDivElement>
    iconSrc: string
    text: string
}

export const ContentHeaderSettingButton: React.FC<ContentHeaderSettingButtonProp> = observer((prop) => {
    return <div
        className='setting-button'
        onClick={(event) => prop.onClick(event)}
    >
        <img
            className={'icon'}
            src={prop.iconSrc}
        />
        <p className='text'>
            {prop.text}
        </p>
    </div>
})
