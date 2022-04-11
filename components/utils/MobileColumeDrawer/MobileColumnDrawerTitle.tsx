import React from 'react'
import { observer } from 'mobx-react'

export interface MobileColumnDrawerTitlePropsInterface {
    title: string
    onClose: Function
}

export const MobileColumnDrawerTitle: React.FC<MobileColumnDrawerTitlePropsInterface> = observer((props) => {
    return (
        <div
            className={'title'}
        >
            <div
                className={'text'}
            >
                {props.title}
            </div>
            <div
                className={'close-button'}
                onClick={() => {
                    props.onClose()
                }}
            >
                닫기
            </div>
        </div>
    )
})
