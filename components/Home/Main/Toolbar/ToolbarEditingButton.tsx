import React, { MouseEventHandler, ReactNode } from 'react'
import { observer } from 'mobx-react'
import { Tooltip } from 'antd'

export interface ToolbarEditingButtonProps {
    icon: ReactNode
    text: string
    onClick: MouseEventHandler<HTMLDivElement>
    disabled?: boolean
}

const Core = (props: ToolbarEditingButtonProps) => {
    return <div
        className={'button' + (props.disabled ? ' disabled' : ' active')}
        onClick={(event) => {
            if (!props.disabled) {
                props.onClick(event)
            }
        }}
    >
        {props.icon}
        <p className='text'>
            {props.text}
        </p>
    </div>
}

export const ToolbarEditingButton
    : React.FC<ToolbarEditingButtonProps> = observer((props) => {
        if (props.disabled) {
            return <Tooltip
                title={'현재 이 기능은 사용할 수 없습니다.'}
                placement={'bottom'}
                trigger={'hover'}
            >
                <div
                    className={'button disabled'}
                >
                    {props.icon}
                    <p className='text'>
                        {props.text}
                    </p>
                </div>
            </Tooltip>
        } else {
            return <div
                className={'button active'}
                onClick={(event) => {
                    props.onClick(event)
                }}
            >
                {props.icon}
                <p className='text'>
                    {props.text}
                </p>
            </div>
        }
    })
