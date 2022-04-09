import React from 'react'
import Modal from 'antd/lib/modal/Modal'

export interface CustomModalProps {
    title: string
    isOpen: boolean
    onCancel: Function
    className?: string
}

export const CustomModal: React.FC<CustomModalProps> = (props) => {
    return <Modal
        className={'modal' + (props.className ? ' ' + props.className : '')}
        title={props.title}
        visible={props.isOpen}
        onCancel={() => props.onCancel()}
        okText={''}
        cancelText={''}
        footer={null}
    >
        {props.children}
    </Modal>
}
