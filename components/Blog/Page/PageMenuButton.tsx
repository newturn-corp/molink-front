import React, { useCallback } from 'react'
import { observer } from 'mobx-react'
import { isBrowser } from 'react-device-detect'
import MenuDotsIcon from 'public/image/icon/menu-dots.svg'
import Blog from '../../../manager/global/Blog/Blog'

export const PageMenuButton: React.FC<{
    pageID: string
}> = observer(({ pageID }) => {
    const pageHierarchy = Blog.pageHierarchy
    const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.preventDefault()
        event.stopPropagation()
        if (isBrowser) {
            Blog.pageHierarchy.contextMenu.open(pageID, null)
        } else {
            pageHierarchy.contextMenu.selectedPageId = pageID
            pageHierarchy.contextMenu.open(pageID, null)
        }
    }, [])

    return <div
        className='menu-button'
        key={`page-menu-button-${pageID}`}
        onClick={(event) => handleClick(event)}
        style={{
            marginRight: isBrowser ? 3 : 6
        }}
    >
        <MenuDotsIcon/>
    </div>
})
