import React, { CSSProperties, useState } from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { BrowserView, isBrowser } from 'react-device-detect'
import { OptionDrawerTitle } from './OptionDrawerTitle'
import { OptionButtonGroup } from './OptionButtonGroup'

export const HierarchyOptionDrawer: React.FC<{
}> = observer(() => {
    const useStyles = makeStyles({
        paper: {
            height: '100%',
            backgroundColor: '#FAFAFB'
        }
    })
    const classes = useStyles()
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy) {
        return <></>
    }
    const selectedPage = currentHierarchy.map[currentHierarchy.selectedPageId]
    return (
        <Drawer
            className='mobile-hierarchy-option-drawer'
            variant={'temporary'}
            anchor={'bottom'}
            open={HierarchyManager.isHierarchyOptionOpen}
            onClose={isBrowser
                ? undefined
                : () => {
                    HierarchyManager.isHierarchyOptionOpen = false
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
