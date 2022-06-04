import React from 'react'
import { observer } from 'mobx-react'
import { HierarchyButton } from './HierarchyButton'
import NewPageIcon from 'public/image/icon/new-page.svg'
import SearchIcon from 'public/image/icon/search.svg'
import LanguageManager from '../../../manager/global/LanguageManager'
import { isMobile } from 'react-device-detect'
import Blog from '../../../manager/global/Blog/Blog'

export const HierarchyButtonGroup: React.FC<{
}> = observer(() => {
    const pageHierarchy = Blog.pageHierarchy
    if (!pageHierarchy.editable) {
        return <></>
    }
    return (
        <>
            <div
                className={'hierarchy-button-group'}
            >
                <HierarchyButton
                    icon={<SearchIcon/>}
                    text={LanguageManager.languageMap.SearchInHierarchy}
                    onClick={async (event) => {
                        event.stopPropagation()
                    }}
                    disabled={true}
                />
                <HierarchyButton
                    icon={<NewPageIcon/>}
                    text={LanguageManager.languageMap.CreateNewPage}
                    onClick={async (event) => {
                        event.stopPropagation()
                        await pageHierarchy.createPage(pageHierarchy.topLevelDocumentIdList.length, null)
                        if (isMobile) {
                            Blog.isOpen = false
                        }
                    }}
                />
            </div>
            <div
                className={'hierarchy-divider'}
            />
        </>
    )
})
