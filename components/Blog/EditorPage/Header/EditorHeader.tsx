import { observer } from 'mobx-react'
import React, { useCallback } from 'react'
import { PageHierarchyList } from './PageHierarchyList'
import { ContentControlButtonGroup } from './ContentControlButtonGroup'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import Blog from '../../../../manager/global/Blog/Blog'

export const EditorHeader: React.FC<{
}> = observer(() => {
    const toolbar = EditorPage.editor.toolbar
    const pageHierarchy = Blog.pageHierarchy

    const getHeaderStyle = useCallback(() => {
        if (!toolbar.enable) {
            return {
                height: 40,
                top: 0
            }
        } else {
            return {
                height: 40,
                top: toolbar.isOpen ? 90 : 40
            }
        }
    }, [toolbar.enable, toolbar.isOpen])

    if (!pageHierarchy || !pageHierarchy.openedPage) {
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
