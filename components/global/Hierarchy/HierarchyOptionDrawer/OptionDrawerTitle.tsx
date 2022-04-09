import React from 'react'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'

export interface OptionDrawerTitlePropsInterface {
    title: string
}

export const OptionDrawerTitle: React.FC<OptionDrawerTitlePropsInterface> = observer((props) => {
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
                    HierarchyManager.isHierarchyOptionOpen = false
                }}
            >
                닫기
            </div>
        </div>
    )
})
