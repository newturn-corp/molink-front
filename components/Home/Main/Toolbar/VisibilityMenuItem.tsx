import React, { MouseEventHandler } from 'react'
import { observer } from 'mobx-react'

export interface VisibilityMenuItemProps {
    iconSrc: string
    name: string
    desc: string
    onClick: MouseEventHandler<HTMLDivElement>
}

export const VisibilityMenuItem: React.FC<VisibilityMenuItemProps> = observer((props: VisibilityMenuItemProps) => {
    return <div
        className={'visibility-menu-item'}
        onClick={(event) => props.onClick(event)}
    >
        <div
            className={'icon'}
        >
            <img
                src={props.iconSrc}
            ></img>
        </div>
        <div
            className={'text-container'}
        >
            <p
                className={'name'}
            >
                {props.name}
            </p>
            <p
                className={'desc'}
            >
                {props.desc}
            </p>
        </div>
    </div>
})
