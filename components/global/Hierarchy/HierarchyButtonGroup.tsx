import React from 'react'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import { HierarchyButton } from './HierarchyButton'
import NewPageIcon from 'public/image/icon/new-page.svg'
import SearchIcon from 'public/image/icon/search.svg'
import DialogManager from '../../../manager/global/DialogManager'

export const HierarchyButtonGroup: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy.editable) {
        return <></>
    }
    return (
        <div
            className={'hierarchy-button-group'}
        >
            <HierarchyButton
                icon={<SearchIcon/>}
                text={'여기서 검색'}
                onClick={async (event) => {
                    event.stopPropagation()
                }}
                disabled={true}
            ></HierarchyButton>
            <HierarchyButton
                icon={<NewPageIcon/>}
                text={'새 페이지 만들기'}
                onClick={async (event) => {
                    event.stopPropagation()
                    await currentHierarchy.createDocument(currentHierarchy.topLevelDocumentIdList.length, null)
                }}
            ></HierarchyButton>
        </div>
    )
})
