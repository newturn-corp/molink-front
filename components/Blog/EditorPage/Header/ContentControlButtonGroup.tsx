import { observer } from 'mobx-react'
import React from 'react'
import RoutingManager, { Page } from '../../../../manager/global/RoutingManager'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Blog/EditorManager'
import { PageHierarchyList } from './PageHierarchyList'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import { LockButton } from './LockButton'
import { VisibilityButton } from './VisibilityButton'
import { PublishButton } from './PublishButton'

export const ContentControlButtonGroup: React.FC<{
}> = observer(() => {
    return <div
        className={'content-control-button-group'}
    >
        <PublishButton/>
        <LockButton/>
        <VisibilityButton/>
    </div>
})
