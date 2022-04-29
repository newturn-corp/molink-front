import React, { MouseEventHandler, ReactNode } from 'react'
import { observer } from 'mobx-react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { MobileColumnDrawer } from '../../../utils/MobileColumeDrawer/MobileColumnDrawer'
import { MobileColumnDrawerGroup } from '../../../utils/MobileColumeDrawer/MobileColumnDrawerGroup'
import { MobileColumnDrawerElement } from '../../../utils/MobileColumeDrawer/MobileColumnDrawerElement'
import Public from '../../../../public/image/editor/toolbar/visibility/public.svg'
import { PageVisibility } from '@newturn-develop/types-molink'
import OnlyFollower from '../../../../public/image/editor/toolbar/visibility/only-follower.svg'
import Private from '../../../../public/image/editor/toolbar/visibility/private.svg'
import { message } from 'antd'

interface VisibilityMenuItemProps {
    icon: ReactNode
    name: string
    desc: string
    onClick: MouseEventHandler<HTMLDivElement>
}

const VisibilityDrawerItem : React.FC<VisibilityMenuItemProps> = observer((props) => {
    return (
        <div
            className={'item'}
            onClick={(event) => {
                props.onClick(event)
            }}
        >
            <div
                className={'icon'}
            >
                {props.icon}
            </div>
            <div
                className={'text-container'}
            >
                <p
                    className={'name'}
                >
                    {props.name}
                </p>
                <p
                    className={'desc'}
                >
                    {props.desc}
                </p>
            </div>
        </div>
    )
})

export const VisibilityDrawer: React.FC<{
}> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy || !currentHierarchy.openedPageId) {
        return <></>
    }
    const visibilityController = currentHierarchy.visibilityController

    return (
        <MobileColumnDrawer
            className={'visibility-drawer'}
            open={visibilityController.isVisibilityDrawerOpen}
            onClose={() => {
                visibilityController.isVisibilityDrawerOpen = false
            }}
            backgroundColor={'#FAFAFB'}
            title={'공개 범위 변경'}
        >
            <MobileColumnDrawerGroup
                style={{
                    marginBottom: 20
                }}
            >
                <MobileColumnDrawerElement
                >
                    <VisibilityDrawerItem
                        name={'전체 공개'}
                        desc={'모두 이 페이지를 볼 수 있습니다.'}
                        icon={<Public/>}
                        onClick={async () => {
                            await visibilityController.updatePageVisibility(currentHierarchy.openedPageId, PageVisibility.Public)
                            visibilityController.isVisibilityDrawerOpen = false
                            message.success('공개 범위가 \'전체 공개\'로 변경되었습니다.')
                        }}
                    />
                </MobileColumnDrawerElement>
                <MobileColumnDrawerElement
                >
                    <VisibilityDrawerItem
                        name={'팔로워만'}
                        desc={'팔로워하는 사람들만 이 페이지를 볼 수 있습니다.'}
                        icon={<OnlyFollower/>}
                        onClick={async () => {
                            await visibilityController.updatePageVisibility(currentHierarchy.openedPageId, PageVisibility.OnlyFollower)
                            visibilityController.isVisibilityDrawerOpen = false
                            message.success('공개 범위가 \'팔로워만\'으로 변경되었습니다.')
                        }}
                    />
                </MobileColumnDrawerElement>
                <MobileColumnDrawerElement
                >
                    <VisibilityDrawerItem
                        name={'비공개'}
                        desc={'나만 이 페이지를 볼 수 있습니다.'}
                        icon={<Private/>}
                        onClick={async () => {
                            await visibilityController.updatePageVisibility(currentHierarchy.openedPageId, PageVisibility.Private)
                            visibilityController.isVisibilityDrawerOpen = false
                            message.success('공개 범위가 \'비공개\'으로 변경되었습니다.')
                        }}
                    />
                </MobileColumnDrawerElement>
            </MobileColumnDrawerGroup>
        </MobileColumnDrawer>
    )
})
