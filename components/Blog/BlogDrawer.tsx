import React from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import UserManager from '../../manager/global/User/UserManager'
import Blog from '../../manager/global/Blog/Blog'
import { isMobile } from 'react-device-detect'
import { makeStyles } from '@material-ui/core'

export const BlogDrawer: React.FC<{
}> = observer(({ children }) => {
    const useStyles = makeStyles({
        paper: {
            width: Blog.getBlogWidth()
        }
    })
    const classes = useStyles()

    return (
        <Drawer
            className={'blog-drawer ' + (isMobile ? 'mobile-blog-drawer' : '')}
            variant={isMobile ? 'temporary' : 'permanent'}
            anchor="left"
            onContextMenu={(event) => {
                event.preventDefault()
                event.stopPropagation()
                Blog.pageHierarchy.contextMenu.open(null, null)
            }}
            style={{
                width: Blog.getBlogWidth(),
                left: UserManager.isUserAuthorized ? 64 : 0
            }}
            classes={classes}
        >
            {children}
        </Drawer>
    )
})
