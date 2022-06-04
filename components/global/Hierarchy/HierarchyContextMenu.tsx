import { Portal } from '@material-ui/core'
import { observer } from 'mobx-react'
import React from 'react'
import Blog from '../../../manager/global/Blog/Blog'

export const HierarchyContextMenu: React.FC = observer(() => {
    const contextMenu = Blog.pageHierarchy.contextMenu

    return <Portal container={globalThis.document.body}>
        <div
            className="contextMenu"
            style={{
                left: contextMenu.clickPosition.x + 5,
                top: contextMenu.clickPosition.y + 5,
                visibility: Blog.pageHierarchy.contextMenu.isOpen ? 'visible' : 'hidden'
            }}
        >
            {
                Blog.pageHierarchy.contextMenu.availControlOptions.map(option =>
                    <div
                        onClick={(e) => {
                            e.stopPropagation()
                            Blog.pageHierarchy.contextMenu.close()
                            option.handleOnClick()
                        }}
                        key={`hierarchy-context-menu-${option}`}
                        className="contextMenu--option"
                    >
                        {option.name}
                    </div>)
            }
        </div>
    </Portal>
})
