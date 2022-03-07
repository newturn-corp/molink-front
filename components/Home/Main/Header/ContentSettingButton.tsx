import React, { MouseEventHandler, ReactNode } from 'react'
import { observer } from 'mobx-react'
import { Tooltip } from 'antd'

export interface ContentHeaderSettingButtonProp {
    onClick: MouseEventHandler<HTMLDivElement>
    icon: ReactNode
    tooltip: string
}

export const ContentSettingButton: React.FC<ContentHeaderSettingButtonProp> = observer((props) => {
    return <Tooltip
        title={props.tooltip}
        placement={'bottom'}
        overlayClassName={'control-button-tooltip'}
    >
        <div
            className='setting-button'
            onClick={(event) => props.onClick(event)}
        >
            {props.icon}
        </div>
    </Tooltip>
})
