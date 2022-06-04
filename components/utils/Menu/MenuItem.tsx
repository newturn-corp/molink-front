import React, { MouseEventHandler, ReactNode } from 'react'
import { observer } from 'mobx-react'

export interface MenuItemProps {
    text: string
    onClick: MouseEventHandler<HTMLDivElement>
    icon?: ReactNode
    selected?: boolean
}

export const MenuItem: React.FC<MenuItemProps> = observer(
    (props: MenuItemProps) => {
        return <div
            className={'menu-item'}
            onClick={(event) => props.onClick(event)}
            style={props.selected
                ? {
                    backgroundColor: '#F2F3F5',
                    color: '#3A7BBF'
                }
                : {
                }
            }
        >
            {props.icon}
            <div className={'text'}>
                {props.text}
            </div>
        </div>
    })
