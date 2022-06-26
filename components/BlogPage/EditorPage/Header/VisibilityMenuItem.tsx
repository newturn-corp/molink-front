import React, { MouseEventHandler, ReactNode } from 'react'
import { observer } from 'mobx-react'

export interface VisibilityMenuItemProps {
    icon: ReactNode
    name: string
    desc: string
    onClick: MouseEventHandler<HTMLDivElement>
}

export const VisibilityMenuItem: React.FC<VisibilityMenuItemProps> = observer(
    (props: VisibilityMenuItemProps) => {
        return <div
            className={'visibility-menu-item'}
            onClick={(event) => props.onClick(event)}
        >
            <div
                className={'icon'}
            >
                {props.icon}
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
