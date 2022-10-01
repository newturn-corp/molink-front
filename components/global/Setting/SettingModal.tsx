import React from 'react'
import Modal from 'antd/lib/modal/Modal'
import { observer } from 'mobx-react'
import SettingManager from '../../../manager/global/Setting/SettingManager'
import { SettingMenu } from './SettingMenu'
import LanguageManager from '../../../manager/global/LanguageManager'

export const SettingModal: React.FC<{
}> = observer(() => {
    return <Modal
        className='setting-modal'
        title={LanguageManager.languageMap.Setting}
        open={SettingManager.isShowSettingModal}
        onCancel={() => SettingManager.closeSettingModal()}
        okText
        cancelText
    >
        <SettingMenu/>
    </Modal>
})
