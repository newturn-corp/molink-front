import React from 'react'
import { observer } from 'mobx-react'
import { Event } from '../../../manager/global/Event/Event'
import StyleManager from '../../../manager/global/Style/StyleManager'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import EventManager from '../../../manager/global/Event/EventManager'

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
            <img
                className={'icon'}
                src={
                    HierarchyManager.isHierarchyOpen
                        ? '/image/global/hierarchy/hierarchy-close-button.png'
                        : '/image/global/hierarchy/hierarchy-open-button.png'
                }
            />
        </div>
    )
})
