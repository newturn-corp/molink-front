import React, { useRef } from 'react'
import { ReactEditor } from 'slate-react'
import { Transforms } from 'slate'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Blog/EditorManager'

export const ContentTitleComponent: React.FC<{
}> = observer(() => {
    const titleRef = useRef()
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    const title = currentHierarchy.map[currentHierarchy.openedDocumentId].title
    return (
        <div
            ref={titleRef}
            className='title'
            contentEditable={EditorManager.editable}
            suppressContentEditableWarning={true}
            style={{
                outline: '0px solid transparent'
            }}
            onBlur={(e) => {
                currentHierarchy.updatePageTitle(currentHierarchy.openedDocumentId, e.currentTarget.textContent)
            }}
            onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'Enter') {
                    e.preventDefault()
                    ReactEditor.focus(EditorManager.slateEditor)
                    Transforms.select(EditorManager.slateEditor, {
                        anchor: {
                            path: [0, 0],
                            offset: 0
                        },
                        focus: {
                            path: [0, 0],
                            offset: 0
                        }
                    })
                    currentHierarchy.updatePageTitle(currentHierarchy.openedDocumentId, e.currentTarget.textContent)
                }
            }}
        >
            {title}
        </div>
    )
})
