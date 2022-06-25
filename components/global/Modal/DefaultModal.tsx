import React from 'react'
import { observer } from 'mobx-react'
import { CustomModal } from '../../utils/CustomModal'
import ModalManager, { Modal } from '../../../manager/global/ModalManager'
import { Button } from '../Button'

export const DefaultModal: React.FC<{
}> = observer(() => {
    return <CustomModal
        className={'default-modal'}
        title={ModalManager.defaultModalTitle}
        onCancel={() => {
            ModalManager.close(Modal.Default)
        }}
        isOpen={ModalManager.map.get(Modal.Default)}
    >
        <div
            className={'desc'}
            style={{
                marginTop: 10,
                marginBottom: 0
            }}
        >
            {ModalManager.defaultModalDescription}
        </div>
        <div
            className={'modal-buttons'}
            style={{
                marginTop: 15
            }}
        >
            {
                ModalManager.defaultModalButtons.map((button, index) => <Button
                    key={`default-modal-button-${index}`}
                    theme={'primary'}
                    text={button.text}
                    style={{
                        width: 100,
                        height: 40
                    }}
                    fontSize={15}
                    onClick={() => {
                        button.onClick()
                    }}
                />)
            }
        </div>
    </CustomModal>
})
