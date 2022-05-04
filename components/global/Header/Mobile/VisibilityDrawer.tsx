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
import LanguageManager from '../../../../manager/global/LanguageManager'

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
                        name={LanguageManager.languageMap.PublicVisibility}
                        desc={LanguageManager.languageMap.PublicVisibilityDescription}
                        icon={<Public/>}
                        onClick={async () => {
                            await visibilityController.updatePageVisibility(currentHierarchy.openedPageId, PageVisibility.Public)
                            visibilityController.isVisibilityDrawerOpen = false
                            message.success(LanguageManager.languageMap.PublicVisibilityChangeMessage)
                        }}
                    />
                </MobileColumnDrawerElement>
                <MobileColumnDrawerElement
                >
                    <VisibilityDrawerItem
                        name={LanguageManager.languageMap.OnlyFollowerVisibility}
                        desc={LanguageManager.languageMap.OnlyFollowerVisibilityDescription}
                        icon={<OnlyFollower/>}
                        onClick={async () => {
                            await visibilityController.updatePageVisibility(currentHierarchy.openedPageId, PageVisibility.OnlyFollower)
                            visibilityController.isVisibilityDrawerOpen = false
                            message.success(LanguageManager.languageMap.OnlyFollowerVisibilityChangeMessage)
                        }}
                    />
                </MobileColumnDrawerElement>
                <MobileColumnDrawerElement
                >
                    <VisibilityDrawerItem
                        name={LanguageManager.languageMap.PrivateVisibility}
                        desc={LanguageManager.languageMap.PrivateVisibilityDescription}
                        icon={<Private/>}
                        onClick={async () => {
                            await visibilityController.updatePageVisibility(currentHierarchy.openedPageId, PageVisibility.Private)
                            visibilityController.isVisibilityDrawerOpen = false
                            message.success(LanguageManager.languageMap.PrivateVisibilityChangeMessage)
                        }}
                    />
                </MobileColumnDrawerElement>
            </MobileColumnDrawerGroup>
        </MobileColumnDrawer>
    )
})
