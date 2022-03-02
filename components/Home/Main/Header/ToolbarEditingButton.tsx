import React, { MouseEventHandler } from 'react'
import { observer } from 'mobx-react'

export interface ToolbarEditingButtonProps {
    imgSrc: string
    text: string
    onClick: MouseEventHandler<HTMLDivElement>
}

export const ToolbarEditingButton
    : React.FC<ToolbarEditingButtonProps> = observer((props) => {
        return <div
            className='button'
            onClick={(event) => props.onClick(event)}
        >
            <img
                className={'icon'}
                src={props.imgSrc}
            />
            <p className='text'>
                {props.text}
            </p>
        </div>
    })
