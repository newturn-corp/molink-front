import React, { ReactNode } from 'react'
import { observer } from 'mobx-react'
import { PersonOutlined } from '@material-ui/icons'
import EditIcon from 'public/image/icon/edit.svg'
import OutlineUploadFileIcon from 'public/image/icon/outline-upload-file.svg'
import { SettingCategoryEnum } from '../UserSetting/UserSettingModalComponent'
import { SettingCategoryComponent } from './SettingCategoryComponent'

export const SettingCategoryListComponent: React.FC<{
    settingCategoryEntry: { category: number, text: string, icon: ReactNode }[]
    currentCategory: number
    onCategoryChange: Function
}> = observer((props) => {
    return <div
        className={'setting-category'}
    >
        <div
            className={'category-group-name'}
        >
            {'설정'}
        </div>
        {
            props.settingCategoryEntry.map((value, index) =>
                <SettingCategoryComponent
                    key={`setting-category-${index}-${value.text}`}
                    icon={value.icon}
                    text={value.text}
                    selected={props.currentCategory === value.category}
                    onClick={() => props.onCategoryChange(value.category)}
                />
            )
        }
    </div>
})
