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
import LanguageManager from '../../../../manager/global/LanguageManager'

export const VisibilityMenu: React.FC<{}
> = observer(() => {
    const currentHierarchy = HierarchyManager.hierarchyMap.get(HierarchyManager.currentHierarchyUserId)
    if (!currentHierarchy || !currentHierarchy.openedPageId) {
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
                    {LanguageManager.languageMap.ChangeVisibility}
                </p>
            </div>
            <VisibilityMenuItem
                name={LanguageManager.languageMap.PublicVisibility}
                desc={LanguageManager.languageMap.PublicVisibilityDescription}
                icon={<Public/>}
                onClick={() =>
                    visibilityController.updatePageVisibility(currentHierarchy.openedPageId, PageVisibility.Public)
                }
            />
            <VisibilityMenuItem
                name={LanguageManager.languageMap.OnlyFollowerVisibility}
                desc={LanguageManager.languageMap.OnlyFollowerVisibilityDescription}
                icon={<OnlyFollower/>}
                onClick={() =>
                    visibilityController.updatePageVisibility(currentHierarchy.openedPageId, PageVisibility.OnlyFollower)
                }
            />
            <VisibilityMenuItem
                name={LanguageManager.languageMap.PrivateVisibility}
                desc={LanguageManager.languageMap.PrivateVisibilityDescription}
                icon={<Private/>}
                onClick={() =>
                    visibilityController.updatePageVisibility(currentHierarchy.openedPageId, PageVisibility.Private)
                }
            />
        </div>
    </Portal>
})
