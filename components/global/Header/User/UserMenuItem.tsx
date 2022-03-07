import React, { MouseEventHandler, ReactNode } from 'react'
import { observer } from 'mobx-react'

export interface UserMenuItemProps {
    text: string
    onClick: MouseEventHandler<HTMLDivElement>
}

export const UserMenuItem: React.FC<UserMenuItemProps> = observer(
    (props: UserMenuItemProps) => {
        return <div
            className={'user-menu-item'}
            onClick={(event) => props.onClick(event)}
        >
            <div className={'text'}>
                {props.text}
            </div>
        </div>
    })
