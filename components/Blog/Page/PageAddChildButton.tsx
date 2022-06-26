import React from 'react'
import { observer } from 'mobx-react'
import { Add } from '@material-ui/icons'
import { isBrowser, isMobile } from 'react-device-detect'
import Blog from '../../../manager/global/Blog/Blog'

export const PageAddChildButton: React.FC<{
    pageID: string
}> = observer(({ pageID }) => {
    const pageHierarchy = Blog.pageHierarchy

    const handleClick = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation()
        await pageHierarchy.pageCreator.create(document.children.length, pageID)
        if (isMobile) {
            Blog.isOpen = false
        }
    }

    return <div
        className='add-page-button'
        key={`add-page-button-${pageID}`}
        onClick={(event) => handleClick(event)}
        style={{
            marginRight: isBrowser ? 8 : 12
        }}
    >
        <Add />
    </div>
})
