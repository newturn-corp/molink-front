import React from 'react'
import { observer } from 'mobx-react'
import { Button } from '../Button'
import { CustomModal } from '../../utils/CustomModal'
import LanguageManager from '../../../manager/global/LanguageManager'
import ModalManager from '../../../manager/global/ModalManager'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'

export const ShouldLoginNoticeModal: React.FC<{
}> = observer(() => {
    return <CustomModal
        className={'should-login-notice-modal'}
        title={'로그인 필요'}
        onCancel={() => {
            ModalManager.openShouldLoginNoticeModal = false
        }}
        isOpen={ModalManager.openShouldLoginNoticeModal}
    >
        <div
            className={'desc'}
            style={{
                marginTop: 10,
                marginBottom: 0
            }}
        >
            {'로그인이 필요한 기능입니다. 로그인 페이지로 이동하시겠습니까?'}
        </div>
        <div
            className={'modal-buttons'}
            style={{
                marginTop: 15
            }}
        >
            <Button
                theme={'primary'}
                text={LanguageManager.languageMap.Accept}
                style={{
                    width: 100,
                    height: 40
                }}
                fontSize={15}
                onClick={() => {
                    ModalManager.openShouldLoginNoticeModal = false
                    RoutingManager.moveTo(Page.SignIn)
                }}
            ></Button>
        </div>
    </CustomModal>
})
