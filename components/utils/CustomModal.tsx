import React, { CSSProperties } from 'react'
import Modal from 'antd/lib/modal/Modal'

export interface CustomModalProps {
    title?: string
    isOpen: boolean
    onCancel: Function
    className?: string
    width?: number
    closable?: boolean
}

export const CustomModal: React.FC<CustomModalProps> = (props) => {
    return <Modal
        className={'modal' + (props.className ? ' ' + props.className : '')}
        title={props.title}
        open={props.isOpen}
        onCancel={() => props.onCancel()}
        okText={''}
        cancelText={''}
        footer={null}
        width={props.width}
        closable={props.closable}
    >
        {props.children}
    </Modal>
}
