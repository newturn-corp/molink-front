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

    const getHeaderStyle = () => {
        if (!toolbar || !toolbar.enable) {
            return {
                height: 40,
                top: 56
            }
        } else {
            return {
                height: 40,
                top: toolbar.isOpen ? 146 : 86
            }
        }
    }

    if (!pageHierarchy || !pageHierarchy.openedPage) {
        return <></>
    }

    return <div
        className={'content-header'}
        style={getHeaderStyle()}
    >
        <PageHierarchyList/>
        {
            Blog.authority.editable && <ContentControlButtonGroup/>
        }
    </div>
})
