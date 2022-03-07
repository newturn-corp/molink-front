import React from 'react'
import { observer } from 'mobx-react'
import { Portal } from '../../../utils/Portal'
import { VisibilityMenuItem } from './VisibilityMenuItem'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { PageVisibility } from '@newturn-develop/types-molink'
import OnlyFollower from 'public/image/editor/toolbar/visibility/only-follower.svg'
import Public from 'public/image/editor/toolbar/visibility/public.svg'
import Private from 'public/image/editor/toolbar/visibility/private.svg'
import StyleManager from '../../../../manager/global/Style/StyleManager'

export const VisibilityMenu: React.FC<{}
> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy || !currentHierarchy.openedDocumentId) {
        return <></>
    }
    const visibilityController = currentHierarchy.visibilityController

    return <Portal>
        <div
            className={'visibility-menu'}
            style={StyleManager.contentStyle.visibilityMenu}
        >
            <div
                className={'title-container'}
            >
                <p
                    className={'menu-title'}
                >
                    {'공개범위 설정'}
                </p>
            </div>
            <VisibilityMenuItem
                name={'전체 공개'}
                desc={'모두 이 페이지를 볼 수 있습니다.'}
                icon={<Public/>}
                onClick={() =>
                    visibilityController.updatePageVisibility(currentHierarchy.openedDocumentId, PageVisibility.Public)
                }
            />
            <VisibilityMenuItem
                name={'팔로워만'}
                desc={'팔로워하는 사람들만 이 페이지를 볼 수 있습니다.'}
                icon={<OnlyFollower/>}
                onClick={() =>
                    visibilityController.updatePageVisibility(currentHierarchy.openedDocumentId, PageVisibility.OnlyFollower)
                }
            />
            <VisibilityMenuItem
                name={'비공개'}
                desc={'나만 이 페이지를 볼 수 있습니다.'}
                icon={<Private/>}
                onClick={() =>
                    visibilityController.updatePageVisibility(currentHierarchy.openedDocumentId, PageVisibility.Private)
                }
            />
        </div>
    </Portal>
})
