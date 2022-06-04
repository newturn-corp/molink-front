import { observer } from 'mobx-react'
import React from 'react'
import { PageVisibility } from '@newturn-develop/types-molink'
import { ContentSettingButton } from './ContentSettingButton'
import { VisibilityMenu } from './VisibilityMenu'
import PublicIcon from '../../../Icon/PublicIcon'
import PrivateIcon from '../../../Icon/PrivateIcon'
import OnlyFollowerIcon from '../../../Icon/OnlyFollowerIcon'
import LanguageManager from '../../../../manager/global/LanguageManager'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../../manager/global/Blog/Blog'

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
    const pageHierarchy = Blog.pageHierarchy
    const page = Blog.pageHierarchy.openedPage
    const editor = EditorPage.editor
    return <>
        <ContentSettingButton
            active={editor.editable && !editor.info.isLocked}
            tooltip={getTextByVisibility(page.visibility)}
            onClick={(event) => {
                event.stopPropagation()
                const { isVisibilityMenuOpen } = pageHierarchy.visibilityController
                pageHierarchy.visibilityController.isVisibilityMenuOpen = !isVisibilityMenuOpen
            }}
            icon={getIconByVisibility(page.visibility)}
        />
        {
            pageHierarchy.visibilityController.isVisibilityMenuOpen &&
                <VisibilityMenu/>
        }
        <></>
    </>
})
