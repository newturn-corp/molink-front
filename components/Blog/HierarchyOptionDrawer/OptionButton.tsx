import React, { ReactNode } from 'react'
import { observer } from 'mobx-react'

export interface OptionDrawerTitlePropsInterface {
    icon: ReactNode
    name: string
    onClick: React.MouseEventHandler<HTMLDivElement>
}

export const OptionButton: React.FC<OptionDrawerTitlePropsInterface> = observer((props) => {
    return (
        <div
            className={'option-button'}
            onClick={(event) => props.onClick(event)}
        >
            {props.icon}
            <div
                className={'name'}
            >
                {props.name}
            </div>
        </div>
    )
})
