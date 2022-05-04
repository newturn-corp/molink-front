import React from 'react'
import { observer } from 'mobx-react'
import EditorManager from '../../../manager/Blog/EditorManager'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import LanguageManager from '../../../manager/global/LanguageManager'

export const ToolbarControlButton: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy || !currentHierarchy.openedPageId) {
        return <></>
    }
    return <div
        className={'toolbar-control-button'}
    >
        {
            EditorManager.isToolbarOpen
                ? <div
                    className={'close'}
                    onClick={async () => {
                        await EditorManager.updateIsToolbarOpen(false)
                    }}
                >
                    <img
                        src={'/image/editor/toolbar/toolbar-close-button.png'}
                    />
                </div>
                : <div
                    className={'open'}
                    onClick={async () => {
                        await EditorManager.updateIsToolbarOpen(true)
                    }}
                >
                    <p
                        className={'text'}
                    >
                        {LanguageManager.languageMap.Toolbar}
                    </p>
                    <div
                        className={'icon'}
                    >
                        <img
                            src={'/image/editor/toolbar/toolbar-close-button.png'}
                        />
                    </div>
                </div>
        }
    </div>
})
