import React from 'react'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../manager/Home/Hierarchy/HierarchyManager'

export const HierarchyOnOffButton: React.FC<{
}> = observer(() => {
    const buttonWidth = 26
    const left = HierarchyManager.getHierarchyWidth() - buttonWidth * 0.5
    return (
        <div
            className={'hierarchy-on-off-button'}
            style={
                {
                    left
                }
            }
            onClick={(event) => {
                event.stopPropagation()
                HierarchyManager.isHierarchyOpen = !HierarchyManager.isHierarchyOpen
                console.log(HierarchyManager.isHierarchyOpen)
            }}
        >
            <img
                className={'icon'}
                src={
                    HierarchyManager.isHierarchyOpen
                        ? '/image/global/hierarchy/hierarchy-close-button.png'
                        : '/image/global/hierarchy/hierarchy-open-button.png'}/>
        </div>
    )
})
