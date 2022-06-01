import { observer } from 'mobx-react'
import React from 'react'
import { PageVisibility } from '@newturn-develop/types-molink'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { ContentSettingButton } from './ContentSettingButton'
import { VisibilityMenu } from './VisibilityMenu'
import PublicIcon from '../../../Icon/PublicIcon'
import PrivateIcon from '../../../Icon/PrivateIcon'
import OnlyFollowerIcon from '../../../Icon/OnlyFollowerIcon'
import EditorManager from '../../../../manager/Blog/EditorManager'
import LanguageManager from '../../../../manager/global/LanguageManager'

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
        return LanguageManager.languageMap.PublicVisibility
    case PageVisibility.OnlyFollower:
        return LanguageManager.languageMap.OnlyFollowerVisibility
    case PageVisibility.Private:
        return LanguageManager.languageMap.PrivateVisibility
    }
}

export const VisibilityButton: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    const page = currentHierarchy.map[currentHierarchy.openedPageId]
    return <>
        <ContentSettingButton
            active={EditorManager.editable}
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
