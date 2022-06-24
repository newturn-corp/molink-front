import React, { CSSProperties } from 'react'
import { observer } from 'mobx-react'
import { Portal } from '../../../utils/Portal'
import { VisibilityMenuItem } from './VisibilityMenuItem'
import { PageVisibility } from '@newturn-develop/types-molink'
import OnlyFollower from 'public/image/editor/toolbar/visibility/only-follower.svg'
import Public from 'public/image/editor/toolbar/visibility/public.svg'
import Private from 'public/image/editor/toolbar/visibility/private.svg'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import LanguageManager from '../../../../manager/global/LanguageManager'
import Blog from '../../../../manager/global/Blog/Blog'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'

export const VisibilityMenu: React.FC<{}
> = observer(() => {
    const pageHierarchy = Blog.pageHierarchy
    const visibilityController = pageHierarchy.visibilityController

    const getVisibilityMenuStyle = () => {
        const style: CSSProperties = {
            right: 20
        }
        const toolbar = EditorPage.editor.toolbar
        if (!EditorPage.editor.toolbar.enable) {
            style.top = 105
        } else {
            style.top = toolbar.isOpen ? 195 : 142
        }
        return style
    }

    return <Portal>
        <div
            className={'visibility-menu'}
            style={getVisibilityMenuStyle()}
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
                    visibilityController.updatePageVisibility(pageHierarchy.openedPage.pageId, PageVisibility.Public)
                }
            />
            <VisibilityMenuItem
                name={LanguageManager.languageMap.OnlyFollowerVisibility}
                desc={LanguageManager.languageMap.OnlyFollowerVisibilityDescription}
                icon={<OnlyFollower/>}
                onClick={() =>
                    visibilityController.updatePageVisibility(pageHierarchy.openedPage.pageId, PageVisibility.OnlyFollower)
                }
            />
            <VisibilityMenuItem
                name={LanguageManager.languageMap.PrivateVisibility}
                desc={LanguageManager.languageMap.PrivateVisibilityDescription}
                icon={<Private/>}
                onClick={() =>
                    visibilityController.updatePageVisibility(pageHierarchy.openedPage.pageId, PageVisibility.Private)
                }
            />
        </div>
    </Portal>
})
