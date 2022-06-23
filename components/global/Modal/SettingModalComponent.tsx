import React, { ReactNode, useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { CustomModal } from '../../utils/CustomModal'
import ModalManager, { Modal } from '../../../manager/global/ModalManager'
import { SettingCategoryListComponent } from './Setting/SettingCategoryListComponent'
import { UserSettingProfileComponent } from './UserSetting/Profile/UserSettingProfileComponent'
import { SettingFileUploadComponent } from './Setting/SettingFileUploadComponent'
import { SettingEditorComponent } from './Setting/SettingEditorComponent'

export enum SettingCategoryEnum {
    Profile,
    FileUpload,
    Editor
}

export const SettingModalComponent: React.FC<{
    isOpen: boolean
    defaultCategory: number
    headerText: string
    settingCategoryEntry: { category: number, text: string, icon: ReactNode }[]
    viewEntry: { [index: number]: ReactNode }
    onCancel: Function
}> = observer((props) => {
    const [category, setCategory] = useState(SettingCategoryEnum.Profile)

    useEffect(() => {
        setCategory(props.defaultCategory)
    }, [props.isOpen])

    return <CustomModal
        className={'setting-modal'}
        closable={false}
        onCancel={() => {
            props.onCancel()
            // ModalManager.close(Modal.UserSetting)
        }}
        isOpen={props.isOpen}
        width={1000}
    >
        <div
            className={'setting-header'}
        >
            {props.headerText}
        </div>
        <div
            style={{
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <SettingCategoryListComponent
                settingCategoryEntry={props.settingCategoryEntry}
                currentCategory={category}
                onCategoryChange={(category) => setCategory(category)}
            />
            <div
                className={'setting-body'}
            >
                {props.viewEntry[category]}
            </div>
        </div>
    </CustomModal>
})
