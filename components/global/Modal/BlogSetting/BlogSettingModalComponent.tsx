import React from 'react'
import { observer } from 'mobx-react'
import ModalManager, { Modal } from '../../../../manager/global/ModalManager'
import { PersonOutlined } from '@material-ui/icons'
import { SettingModalComponent } from '../SettingModalComponent'
import { BlogSettingProfileComponent } from './Profile/BlogSettingProfileComponent'
import FlagIcon from 'public/image/icon/flag.svg'

export enum SettingCategoryEnum {
    Profile,
    FileUpload,
    Editor
}

const categoryEntry = [
    {
        text: '프로필',
        icon: <FlagIcon/>,
        category: SettingCategoryEnum.Profile
    }
]

const viewEntry = {
    [SettingCategoryEnum.Profile]: <BlogSettingProfileComponent/>
}

export const BlogSettingModalComponent: React.FC<{
}> = observer(() => {
    const isOpen = ModalManager.map.get(Modal.BlogSetting)

    return <SettingModalComponent
        isOpen={isOpen}
        onCancel={() => {
            ModalManager.close(Modal.BlogSetting)
        }}
        headerText={'블로그 설정'}
        settingCategoryEntry={categoryEntry}
        defaultCategory={SettingCategoryEnum.Profile}
        viewEntry={viewEntry}
    />
})
