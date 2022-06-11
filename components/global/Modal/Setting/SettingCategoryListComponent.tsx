import React from 'react'
import { observer } from 'mobx-react'
import { PersonOutlined } from '@material-ui/icons'
import EditIcon from 'public/image/icon/edit.svg'
import OutlineUploadFileIcon from 'public/image/icon/outline-upload-file.svg'
import { SettingCategoryEnum } from '../SettingModalComponent'
import { SettingCategoryComponent } from './SettingCategoryComponent'

export const SettingCategoryListComponent: React.FC<{
    category: SettingCategoryEnum
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
        <SettingCategoryComponent
            icon={<PersonOutlined/>}
            text={'프로필'}
            selected={props.category === SettingCategoryEnum.Profile}
            onClick={() => props.onCategoryChange(SettingCategoryEnum.Profile)}
        />
        <SettingCategoryComponent
            icon={<EditIcon/>}
            text={'에디터'}
            selected={props.category === SettingCategoryEnum.Editor}
            onClick={() => props.onCategoryChange(SettingCategoryEnum.Editor)}
        />
        <SettingCategoryComponent
            icon={<OutlineUploadFileIcon/>}
            text={'파일 업로드'}
            selected={props.category === SettingCategoryEnum.FileUpload}
            onClick={() => props.onCategoryChange(SettingCategoryEnum.FileUpload)}
        />
    </div>
})
