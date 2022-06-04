import React from 'react'
import { observer } from 'mobx-react'
import { MenuRounded } from '@material-ui/icons'
import Blog from '../../../manager/global/Blog/Blog'

export const OpenHierarchyButton: React.FC<{
}> = observer(() => {
    return <div
        className='open-hierarchy-button'
        onClick={() => {
            Blog.isOpen = true
        }}
    >
        <MenuRounded/>
    </div>
})
