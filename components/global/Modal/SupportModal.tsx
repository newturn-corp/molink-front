import React, { useEffect, useRef } from 'react'
import Modal from 'antd/lib/modal/Modal'
import TextArea from 'antd/lib/input/TextArea'
import { observer } from 'mobx-react'
import SupportManager from '../../../manager/global/SupportManager'
import { Button } from '../Button'
import { TextAreaRef } from 'antd/es/input/TextArea'
import { CustomModal } from '../../utils/CustomModal'

export const SupportModal: React.FC<{
  }> = observer(() => {
      const textAreaRef = useRef<TextAreaRef>()
      useEffect(() => {
          SupportManager.supportModalTextAreaRef = textAreaRef
      }, [textAreaRef])

      return <CustomModal
          title="문의 & 의견"
          onCancel={() => SupportManager.handleCancel()}
          isOpen={SupportManager.showSupportModal}
      >
          <pre
              className={'desc'}
          >
              {'Molink 서비스에 대해 문의 사항이나 의견이 있으시다면 편하게 전달해주세요!\n이메일을 통해 빠른 시일 내에 답변드리겠습니다!'}
          </pre>
          <TextArea
              ref={textAreaRef}
              placeholder={'문의사항을 입력해주세요.'}
              showCount
              value={SupportManager.content}
              maxLength={300}
              onChange={(e) => SupportManager.handleChange(e)}
              autoSize={{ minRows: 1, maxRows: 4 }}
          />
          <div
              className={'modal-buttons'}
          >
              <Button
                  theme={'primary'}
                  text={'전송'}
                  style={{
                      width: 100,
                      height: 40
                  }}
                  fontSize={15}
                  onClick={() => SupportManager.handleOk()}
              ></Button>
          </div>
      </CustomModal>
  })
