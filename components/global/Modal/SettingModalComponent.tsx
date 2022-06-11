import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { CustomModal } from '../../utils/CustomModal'
import ModalManager, { Modal } from '../../../manager/global/ModalManager'
import { SettingCategoryListComponent } from './Setting/SettingCategoryListComponent'
import { SettingProfileComponent } from './Setting/SettingProfileComponent'
import { SettingFileUploadComponent } from './Setting/SettingFileUploadComponent'
import { SettingEditorComponent } from './Setting/SettingEditorComponent'

export enum SettingCategoryEnum {
    Profile = 'profile',
    FileUpload = 'file-upload',
    Editor = 'editor'
}

export const SettingModalComponent: React.FC<{
}> = observer(() => {
    const [category, setCategory] = useState(SettingCategoryEnum.Profile)
    const isOpen = ModalManager.map.get(Modal.Setting)

    const mainView = () => {
        switch (category) {
        case SettingCategoryEnum.Profile:
            return <SettingProfileComponent/>
        case SettingCategoryEnum.Editor:
            return <SettingEditorComponent/>
        case SettingCategoryEnum.FileUpload:
            return <SettingFileUploadComponent/>
        }
    }

    return <CustomModal
        className={'setting-modal'}
        closable={false}
        onCancel={() => {
            ModalManager.close(Modal.Setting)
        }}
        isOpen={isOpen}
        width={1000}
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'row'
            }}
        >
            <SettingCategoryListComponent
                category={category}
                onCategoryChange={(category) => setCategory(category)}
            />
            <div
                className={'setting-body'}
            >
                {mainView()}
            </div>
        </div>
    </CustomModal>
})
