import { observer } from 'mobx-react'
import React from 'react'
import MainPage from '../../../manager/Main/MainPage'
import LanguageManager from '../../../manager/global/LanguageManager'
import UserManager from '../../../manager/global/User/UserManager'
import ModalManager, { Modal } from '../../../manager/global/ModalManager'
import GlobalManager from '../../../manager/global/GlobalManager'

export const CategoryContainer: React.FC<{
}> = observer(() => {
    return <div
        className={'category-container'}
        style={{
            // margin: GlobalManager.isBrowser ? '0 auto' : undefined
        }}
    >
        {
            MainPage.pageLists.map((pageList, index) => {
                const isActiveCategory = index === MainPage.currentCategoryIndex
                return <div
                    key={`main-page-category-${index}`}
                    className={'category' + (isActiveCategory ? ' active-category' : '')}
                    onClick={() => {
                        if (!isActiveCategory) {
                            if (pageList.category === LanguageManager.languageMap.Follow && !UserManager.isUserAuthorized) {
                                ModalManager.open(Modal.ShouldLoginNotice)
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
