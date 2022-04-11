import React, { MouseEventHandler, ReactNode } from 'react'
import { observer } from 'mobx-react'
import { Tooltip } from 'antd'

export interface ToolbarEditingButtonProps {
    icon: ReactNode
    onClick: MouseEventHandler<HTMLDivElement>
    size: 'standard' | 'small'
    desc: string
    text?: string
    disabled?: boolean
}

// 버그 : 왜인지 중복 코드를 사용하지 않으면 Tooltip이 적용되지 않음
export const ToolbarEditingButton
    : React.FC<ToolbarEditingButtonProps> = (props) => {
        return <Tooltip
            title={props.disabled ? '현재 이 기능은 사용할 수 없습니다.' : props.desc}
            mouseEnterDelay={props.disabled ? undefined : 1}
            placement={'bottom'}
            trigger={'hover'}
        >
            <div
                className={'toolbar-editing-button' + (props.disabled ? ' disabled' : ' active') + ' ' + props.size}
                onClick={(event) => {
                    if (props.disabled) {
                        return
                    }
                    props.onClick(event)
                }}
            >
                {props.icon}
                {props.children}
                {
                    props.text && <p className='text'>
                        {props.text}
                    </p>
                }
            </div>
        </Tooltip>
    }
