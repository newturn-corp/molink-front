import React, { ReactNode } from 'react'
import { observer } from 'mobx-react'

export const SettingCategoryComponent: React.FC<{
    icon: ReactNode,
    text: string,
    selected: boolean,
    onClick: Function
}> = observer((props) => {
    return <div
        className={'category' + (props.selected ? ' selected' : '')}
        onClick={(event) => {
            event.stopPropagation()
            props.onClick()
        }}
    >
        {props.icon}
        <div
            className={'text'}
        >
            {props.text}
        </div>
    </div>
})
