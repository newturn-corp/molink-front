import React, { useRef } from 'react'
import { observer } from 'mobx-react'
import { HierarchyButton } from './HierarchyButton'
import NewPageIcon from 'public/image/icon/new-page.svg'
import SearchIcon from 'public/image/icon/search.svg'
import SettingIcon from 'public/image/icon/setting-outline.svg'
import NotificationIcon from 'public/image/icon/notification.svg'
import LanguageManager from '../../../manager/global/LanguageManager'
import { isMobile } from 'react-device-detect'
import Blog from '../../../manager/global/Blog/Blog'
import ModalManager, { Modal } from '../../../manager/global/ModalManager'

export const BlogButtonGroupComponent: React.FC<{
}> = observer(() => {
    const pageHierarchy = Blog.pageHierarchy
    const notificationButtonRef = useRef(null)
    if (!Blog.authority?.editable) {
        return <></>
    }
    return (
        <>
            <div
                className={'hierarchy-button-group'}
            >
                <HierarchyButton
                    icon={<SearchIcon/>}
                    text={LanguageManager.languageMap.SearchInHierarchy}
                    onClick={async (event) => {
                        event.stopPropagation()
                    }}
                    disabled={true}
                />
                <HierarchyButton
                    icon={<NewPageIcon/>}
                    text={LanguageManager.languageMap.CreateNewPage}
                    onClick={async (event) => {
                        event.stopPropagation()
                        await pageHierarchy.pageCreator.create(pageHierarchy.topLevelDocumentIdList.length, null)
                        if (isMobile) {
                            Blog.isOpen = false
                        }
                    }}
                />
                <HierarchyButton
                    ref={notificationButtonRef}
                    icon={<NotificationIcon/>}
                    text={'알림'}
                    onClick={async (event) => {
                        event.stopPropagation()
                        Blog.notifications.view.open()
                    }}
                />
                <HierarchyButton
                    icon={<SettingIcon/>}
                    text={'설정'}
                    onClick={async (event) => {
                        event.stopPropagation()
                        ModalManager.open(Modal.BlogSetting)
                    }}
                />
            </div>
        </>
    )
})