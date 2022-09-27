import React from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { isBrowser } from 'react-device-detect'
import { OptionDrawerTitle } from './OptionDrawerTitle'
import { OptionButtonGroup } from './OptionButtonGroup'
import Blog from '../../../manager/global/Blog/Blog'

export const HierarchyOptionDrawer: React.FC<{
}> = observer(() => {
    const useStyles = makeStyles({
        paper: {
            height: '100%',
            backgroundColor: '#FAFAFB'
        }
    })
    const classes = useStyles()
    const pageHierarchy = Blog.pageHierarchy
    if (!pageHierarchy || !pageHierarchy.contextMenu) {
        return <></>
    }
    const selectedPage = pageHierarchy.map[pageHierarchy.contextMenu.selectedPageId]
    return (
        <Drawer
            className='mobile-hierarchy-option-drawer'
            variant={'temporary'}
            anchor={'bottom'}
            open={pageHierarchy.contextMenu.isOpen}
            onClose={isBrowser
                ? undefined
                : () => {
                    pageHierarchy.contextMenu.close()
                }}
            classes={classes}
        >
            <OptionDrawerTitle
                title={selectedPage ? selectedPage.title : '옵션'}
            />
            <OptionButtonGroup/>
        </Drawer>
    )
})
