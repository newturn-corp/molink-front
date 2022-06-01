import { observer } from 'mobx-react'
import React from 'react'
import MainPage from '../../../manager/Main/MainPage'
import LanguageManager from '../../../manager/global/LanguageManager'
import UserManager from '../../../manager/global/User/UserManager'
import ModalManager from '../../../manager/global/ModalManager'

export const CategoryContainer: React.FC<{
}> = observer(() => {
    return <div className={'category-container'}>
        {
            MainPage.pageLists.map((pageList, index) => {
                const isActiveCategory = index === MainPage.currentCategoryIndex
                return <div
                    key={`main-page-category-${index}`}
                    className={'category' + (isActiveCategory ? ' active-category' : '')}
                    onClick={() => {
                        if (!isActiveCategory) {
                            if (pageList.category === LanguageManager.languageMap.Follow && !UserManager.isUserAuthorized) {
                                ModalManager.openShouldLoginNoticeModal = true
                                return
                            }
                            MainPage.setCurrentCategoryIndex(index)
                        }
                    }}
                >
                    {pageList.category}
                </div>
            })
        }
    </div>
})
