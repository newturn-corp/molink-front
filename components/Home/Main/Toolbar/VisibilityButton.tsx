import { observer } from 'mobx-react'
import React, { useState } from 'react'
import { PageVisibility } from '@newturn-develop/types-molink'
import EditorManager from '../../../../manager/Blog/EditorManager'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { ContentHeaderSettingButton } from '../Header/ContentHeaderSettingButton'
import { VisibilityMenu } from './VisibilityMenu'

const getIconSrcByVisibility = (visibility: PageVisibility) => {
    switch (visibility) {
    case PageVisibility.Public:
        return '/image/editor/toolbar/visibility/public.svg'
    case PageVisibility.OnlyFollower:
        return '/image/editor/toolbar/visibility/private.svg'
    case PageVisibility.Private:
        return '/image/editor/toolbar/visibility/only-follower.svg'
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
    if (!currentHierarchy || !currentHierarchy.openedDocumentId) {
        return <></>
    }
    const page = currentHierarchy.map[currentHierarchy.openedDocumentId]
    return <>
        <ContentHeaderSettingButton
            onClick={(event) => {
                event.stopPropagation()
                currentHierarchy.visibilityController.isVisibilityMenuOpen = true
            }}
            iconSrc={
                getIconSrcByVisibility(page.visibility)}
            text={
                getTextByVisibility(page.visibility)
            }
        />
        {
            currentHierarchy.visibilityController.isVisibilityMenuOpen
                ? <VisibilityMenu></VisibilityMenu>
                : <></>
        }
        <></>
    </>
})
