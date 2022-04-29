import React from 'react'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import { HierarchyButton } from './HierarchyButton'
import NewPageIcon from 'public/image/icon/new-page.svg'
import SearchIcon from 'public/image/icon/search.svg'
import DialogManager from '../../../manager/global/DialogManager'
import LanguageManager from '../../../manager/global/LanguageManager'
import { isMobile } from 'react-device-detect'

export const HierarchyButtonGroup: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy.editable) {
        return <></>
    }
    return (
        <>
            <div
                className={'hierarchy-divider'}
            />
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
                ></HierarchyButton>
                <HierarchyButton
                    icon={<NewPageIcon/>}
                    text={LanguageManager.languageMap.CreateNewPage}
                    onClick={async (event) => {
                        event.stopPropagation()
                        await currentHierarchy.createDocument(currentHierarchy.topLevelDocumentIdList.length, null)
                        if (isMobile) {
                            HierarchyManager.isHierarchyOpen = false
                        }
                    }}
                ></HierarchyButton>
            </div>
            <div
                className={'hierarchy-divider'}
            />
        </>
    )
})
