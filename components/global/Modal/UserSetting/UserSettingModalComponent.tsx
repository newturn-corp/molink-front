import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { CustomModal } from '../../../utils/CustomModal'
import ModalManager, { Modal } from '../../../../manager/global/ModalManager'
import { SettingCategoryListComponent } from '../Setting/SettingCategoryListComponent'
import { UserSettingProfileComponent } from './Profile/UserSettingProfileComponent'
import { SettingFileUploadComponent } from '../Setting/SettingFileUploadComponent'
import { SettingEditorComponent } from '../Setting/SettingEditorComponent'
import { PersonOutlined } from '@material-ui/icons'
import EditIcon from '../../../../public/image/icon/edit.svg'
import OutlineUploadFileIcon from '../../../../public/image/icon/outline-upload-file.svg'
import { SettingModalComponent } from '../SettingModalComponent'

export enum SettingCategoryEnum {
    Profile,
    FileUpload,
    Editor
}

const categoryEntry = [
    {
        text: '프로필',
        icon: <PersonOutlined/>,
        category: SettingCategoryEnum.Profile
    },
    {
        text: '에디터',
        icon: <EditIcon/>,
        category: SettingCategoryEnum.Editor
    },
    {
        text: '파일 업로드',
        icon: <OutlineUploadFileIcon/>,
        category: SettingCategoryEnum.FileUpload
    }
]

const viewEntry = {
    [SettingCategoryEnum.Profile]: <UserSettingProfileComponent/>,
    [SettingCategoryEnum.Editor]: <SettingEditorComponent/>,
    [SettingCategoryEnum.FileUpload]: <SettingFileUploadComponent/>
}

export const UserSettingModalComponent: React.FC<{
}> = observer(() => {
    const isOpen = ModalManager.map.get(Modal.UserSetting)

    return <SettingModalComponent
        isOpen={isOpen}
        onCancel={() => {
            ModalManager.close(Modal.UserSetting)
        }}
        headerText={'사용자 설정'}
        settingCategoryEntry={categoryEntry}
        defaultCategory={SettingCategoryEnum.Profile}
        viewEntry={viewEntry}
    />
})
