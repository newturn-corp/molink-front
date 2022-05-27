import React, { useEffect, useRef } from 'react'
import { ReactEditor } from 'slate-react'
import { Transforms } from 'slate'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Blog/EditorManager'
import { TextCategory } from '../../../../Types/slate/CustomElement'
import { isBrowser } from 'react-device-detect'

export const ContentTitleComponent: React.FC<{
}> = observer(() => {
    const titleRef = useRef<HTMLDivElement>()
    useEffect(() => {
        EditorManager.titleRef = titleRef
    }, [titleRef])
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    const title = currentHierarchy.map[currentHierarchy.openedPageId].title
    return (
        <div
            ref={titleRef}
            className='title'
            contentEditable={EditorManager.editable && !EditorManager.isLocked}
            suppressContentEditableWarning={true}
            style={{
                outline: '0px solid transparent',
                fontSize: isBrowser ? 40 : 32
            }}
            onBlur={(e) => {
                currentHierarchy.updatePageTitle(currentHierarchy.openedPageId, e.currentTarget.textContent)
            }}
            onKeyDown={(e) => {
                const selection = document.getSelection()
                const textContent = e.currentTarget.textContent
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
                    currentHierarchy.updatePageTitle(currentHierarchy.openedPageId, e.currentTarget.textContent)
                } else if (e.key === 'ArrowRight') {
                    if (selection.anchorOffset === textContent.length) {
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
                        currentHierarchy.updatePageTitle(currentHierarchy.openedPageId, e.currentTarget.textContent)
                    }
                } else if (e.key === 'Enter') {
                    e.preventDefault()
                    // Bug: Selection이 Collapsed 되어있지 않은 경우에 대한 디테일 처리 필요.
                    const newTitle = selection.anchorOffset === 0 ? '새 페이지' : textContent.slice(0, selection.anchorOffset)
                    const newContent = textContent.slice(selection.anchorOffset, textContent.length)
                    Transforms.insertNodes(EditorManager.slateEditor, {
                        type: 'text',
                        category: TextCategory.Content3,
                        children: [{ text: newContent }]
                    }, {
                        at: [0]
                    })
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
                    currentHierarchy.updatePageTitle(currentHierarchy.openedPageId, newTitle)
                }
            }}
        >
            {title}
        </div>
    )
})
