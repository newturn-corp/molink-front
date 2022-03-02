import React from 'react'
import Modal from 'antd/lib/modal/Modal'
import TextArea from 'antd/lib/input/TextArea'
import { observer } from 'mobx-react'
import SupportManager from '../../../../manager/global/SupportManager'

export const SupportModal: React.FC<{
  }> = observer(() => {
      return <Modal
          className='support-modal'
          title="문의 & 의견"
          visible={SupportManager.showSupportModal}
          onOk={() => SupportManager.handleOk()}
          onCancel={() => SupportManager.handleCancel()}
          okText={'전송'}
          cancelText
      >
          <p>{'Molink 서비스에 대해 문의 사항이나 의견이 있으시다면'}</p>
          <p>{'편하게 전달해주세요! 이메일을 통해 빠른 시일 내에 답변드리겠습니다!'}</p>
          <TextArea
              showCount
              value={SupportManager.content}
              maxLength={300}
              style={{ height: 120 }}
              onChange={(e) => SupportManager.handleChange(e)}
          />
      </Modal>
  })
