import React, { MouseEventHandler, ReactNode } from 'react'
import { observer } from 'mobx-react'
import { Tooltip } from 'antd'

export interface ContentHeaderSettingButtonProp {
    onClick: MouseEventHandler<HTMLDivElement>
    icon: ReactNode
    tooltip: string
    active: boolean
}

export const ContentSettingButton: React.FC<ContentHeaderSettingButtonProp> = observer((props) => {
    return <Tooltip
        title={props.tooltip}
        placement={'bottom'}
        overlayClassName={'control-button-tooltip'}
    >
        <div
            className={'setting-button' + (props.active ? ' active' : '')}
            onClick={(event) => {
                if (!props.active) {
                    return
                }
                props.onClick(event)
            }}
        >
            {props.icon}
        </div>
    </Tooltip>
})
