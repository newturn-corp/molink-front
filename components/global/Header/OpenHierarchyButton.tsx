import React from 'react'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import { MenuRounded } from '@material-ui/icons'

export const OpenHierarchyButton: React.FC<{
}> = observer(() => {
    return <div
        className='open-hierarchy-button'
        onClick={() => {
            HierarchyManager.isHierarchyOpen = true
        }}
    >
        <MenuRounded/>
    </div>
})
