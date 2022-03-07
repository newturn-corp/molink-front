import React from 'react'
import { observer } from 'mobx-react'
import { Event } from '../../../manager/global/Event/Event'
import StyleManager from '../../../manager/global/Style/StyleManager'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import EventManager from '../../../manager/global/Event/EventManager'
import ArrowLeft from '/public/image/icon/arrow-left.svg'
import ArrowRight from '/public/image/icon/arrow-right.svg'

export const HierarchyOnOffButton: React.FC<{
}> = observer(() => {
    return (
        <div
            className={'hierarchy-on-off-button'}
            style={StyleManager.hierarchyStyle.onOffButtonStyle}
            onClick={async (event) => {
                event.stopPropagation()
                HierarchyManager.isHierarchyOpen = !HierarchyManager.isHierarchyOpen
                await EventManager.issueEvent(Event.HierarchyOnOffChange, {
                    onOff: HierarchyManager.isHierarchyOpen
                })
            }}
        >
            {
                HierarchyManager.isHierarchyOpen
                    ? <ArrowLeft/>
                    : <ArrowRight/>
            }
        </div>
    )
})
