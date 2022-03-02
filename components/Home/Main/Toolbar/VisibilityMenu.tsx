import React from 'react'
import { observer } from 'mobx-react'
import { Portal } from '../../../utils/Portal'
import { VisibilityMenuItem } from './VisibilityMenuItem'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import { PageVisibility } from '@newturn-develop/types-molink'

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
            style={{
                position: 'absolute',
                zIndex: 1
            }}
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
                iconSrc={'/image/editor/toolbar/visibility/public.svg'}
                onClick={() =>
                    visibilityController.updatePageVisibility(currentHierarchy.openedDocumentId, PageVisibility.Public)
                }
            />
            <VisibilityMenuItem
                name={'팔로워만'}
                desc={'팔로워하는 사람들만 이 페이지를 볼 수 있습니다.'}
                iconSrc={'/image/editor/toolbar/visibility/only-follower.svg'}
                onClick={() =>
                    visibilityController.updatePageVisibility(currentHierarchy.openedDocumentId, PageVisibility.OnlyFollower)
                }
            />
            <VisibilityMenuItem
                name={'비공개'}
                desc={'나만 이 페이지를 볼 수 있습니다.'}
                iconSrc={'/image/editor/toolbar/visibility/private.svg'}
                onClick={() =>
                    visibilityController.updatePageVisibility(currentHierarchy.openedDocumentId, PageVisibility.Private)
                }
            />
        </div>
    </Portal>
})
