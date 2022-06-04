import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { PageHierarchyList } from './PageHierarchyList'
import { ContentControlButtonGroup } from './ContentControlButtonGroup'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../../manager/global/Blog/Blog'

export const EditorHeader: React.FC<{
}> = observer(() => {
    const editor = EditorPage.editor
    const pageHierarchy = Blog.pageHierarchy

    const getHeaderStyle = useCallback(() => {
        if (!editor.editable || editor.info?.isLocked) {
            return {
                height: 40,
                top: 0
            }
        } else {
            return {
                height: 40,
                top: editor.toolbar.isOpen ? 90 : 40
            }
        }
    }, [editor.toolbar, editor.toolbar?.isOpen, editor.editable, editor.info, editor.info?.isLocked])

    if (!pageHierarchy || !pageHierarchy.openedPage || !editor.isLoaded) {
        return <></>
    }

    return <div
        className={'content-header'}
        style={getHeaderStyle()}
    >
        <PageHierarchyList/>
        {
            pageHierarchy.editable && <ContentControlButtonGroup/>
        }
    </div>
})
