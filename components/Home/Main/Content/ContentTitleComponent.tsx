import React, { useRef } from 'react'
import HierarchyManager from '../../../../manager/Home/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Home/EditorManager'
import { ReactEditor } from 'slate-react'
import { Transforms } from 'slate'
import { observer } from 'mobx-react'

export const ContentTitleComponent: React.FC<{
}> = observer(() => {
    const titleRef = useRef()
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyNickname)
    const title = currentHierarchy.map[currentHierarchy.openedDocumentId].title
    return (
        <div
            ref={titleRef}
            className='title'
            contentEditable={EditorManager.editable}
            style={{
                outline: '0px solid transparent'
            }}
            onBlur={(e) => {
                currentHierarchy.updateDocumentTitle(currentHierarchy.openedDocumentId, e.currentTarget.textContent)
            }}
            onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
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
                }
            }}
        >
            {title}
        </div>
    )
})
