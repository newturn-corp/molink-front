import React from 'react'
import { observer } from 'mobx-react'
import { Avatar } from '@material-ui/core'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import Blog from '../../manager/global/Blog/Blog'

export const DragGhostParent: React.FC<{
}> = observer(() => {
    return (
        <div
            id={'drag-ghost-parent'}
            className={'drag-ghost-parent'}
        />
    )
})
