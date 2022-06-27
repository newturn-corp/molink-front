import { observer } from 'mobx-react'
import React from 'react'
import Blog from '../../../manager/global/Blog/Blog'
import ModalManager, { Modal } from '../../../manager/global/ModalManager'

export const SettingProfileButton: React.FC<{
    blogID: number
}> = observer((props) => {
    return <></>
    // return <div
    //     className='profile-setting-button no-select'
    //     onClick={() => ModalManager.open(Modal.BlogSetting)}
    // >
    //     {'프로필 편집'}
    // </div>
})
