import React from 'react'
import { observer } from 'mobx-react'
import { Portal } from '../../utils/Portal'
import { HierarchyOptionDrawer } from '../HierarchyOptionDrawer/HierarchyOptionDrawer'
import { BlogComponent } from '../BlogComponent'

export const MobileBlogComponent: React.FC<{
}> = observer(() => {
    return (
        <Portal>
            <HierarchyOptionDrawer/>
            <BlogComponent/>
        </Portal>
    )
})
