import { observer } from 'mobx-react'
import React from 'react'
import { PageVisibility } from '@newturn-develop/types-molink'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { ContentSettingButton } from './ContentSettingButton'
import { VisibilityMenu } from './VisibilityMenu'
import PublicIcon from '../../../Icon/PublicIcon'
import PrivateIcon from '../../../Icon/PrivateIcon'
import OnlyFollowerIcon from '../../../Icon/OnlyFollowerIcon'

const getIconByVisibility = (visibility: PageVisibility) => {
    switch (visibility) {
    case PageVisibility.Public:
        return <PublicIcon/>
    case PageVisibility.OnlyFollower:
        return <OnlyFollowerIcon/>
    case PageVisibility.Private:
        return <PrivateIcon/>
    }
}

const getTextByVisibility = (visibility: PageVisibility) => {
    switch (visibility) {
    case PageVisibility.Public:
        return '전체 공개'
    case PageVisibility.OnlyFollower:
        return '팔로워만'
    case PageVisibility.Private:
        return '비공개'
    }
}

export const VisibilityButton: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    const page = currentHierarchy.map[currentHierarchy.openedDocumentId]
    return <>
        <ContentSettingButton
            tooltip={getTextByVisibility(page.visibility)}
            onClick={(event) => {
                event.stopPropagation()
                const { isVisibilityMenuOpen } = currentHierarchy.visibilityController
                currentHierarchy.visibilityController.isVisibilityMenuOpen = !isVisibilityMenuOpen
            }}
            icon={getIconByVisibility(page.visibility)}
        />
        {
            currentHierarchy.visibilityController.isVisibilityMenuOpen
                ? <VisibilityMenu/>
                : <></>
        }
        <></>
    </>
})
