import React from 'react'
import { observer } from 'mobx-react'
import { Avatar } from '@material-ui/core'
import Identicon from 'identicon.js'
import crypto from 'crypto'
import HierarchyManager from '../../../manager/global/Hierarchy/HierarchyManager'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'

export const HierarchyName: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy) {
        return <></>
    }
    return (
        <>
            <div
                className={'hierarchy-name'}
                onClick={() => {
                    currentHierarchy.openedPageId = null
                    RoutingManager.moveTo(Page.Blog, `/${currentHierarchy.nickname}`)
                }}
            >
                <Avatar
                    className='profile-image'
                    sizes='32'
                    src={`data:image/png;base64,${
                        new Identicon(
                            crypto.createHash('sha512')
                                .update(currentHierarchy.nickname)
                                .digest('base64'), {
                                size: 64,
                                foreground: [58, 123, 191, 255]
                            }).toString()}`}
                />
                <div
                    className='text'
                >
                    {`${currentHierarchy.nickname}의 공간`}
                </div>
            </div>
            <div className={'hierarchy-divider'}/>
        </>
    )
})
