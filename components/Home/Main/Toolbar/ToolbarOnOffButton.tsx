import React from 'react'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Blog/EditorManager'
import ArrowDownDoubleIcon from 'public/image/icon/arrow-down-double.svg'
import ArrowUpDoubleIcon from 'public/image/icon/arrow-up-double.svg'
import StyleManager from '../../../../manager/global/Style/StyleManager'

export const ToolbarOnOffButton: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy || !currentHierarchy.openedPageId) {
        return <></>
    }
    return <div
        className={'toolbar-control-button'}
        style={StyleManager.contentStyle.toolbarOnOffButton}
        onClick={async () => {
            await EditorManager.updateIsToolbarOpen(!EditorManager.isToolbarOpen)
        }}
    >
        {
            EditorManager.isToolbarOpen
                ? <ArrowUpDoubleIcon/>
                : <ArrowDownDoubleIcon/>
        }
    </div>
})
