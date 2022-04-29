import React, { useEffect, useRef } from 'react'
import Modal from 'antd/lib/modal/Modal'
import TextArea from 'antd/lib/input/TextArea'
import { observer } from 'mobx-react'
import SupportManager from '../../../manager/global/SupportManager'
import { Button } from '../Button'
import { TextAreaRef } from 'antd/es/input/TextArea'
import { CustomModal } from '../../utils/CustomModal'
import LanguageManager from '../../../manager/global/LanguageManager'

export const SupportModal: React.FC<{
  }> = observer(() => {
      const textAreaRef = useRef<TextAreaRef>()
      useEffect(() => {
          SupportManager.supportModalTextAreaRef = textAreaRef
      }, [textAreaRef])

      return <CustomModal
          title={LanguageManager.languageMap.get('Support')}
          onCancel={() => SupportManager.handleCancel()}
          isOpen={SupportManager.showSupportModal}
      >
          <div
              className={'desc'}
          >
              {LanguageManager.languageMap.get('SupportDescription')}
          </div>
          <TextArea
              ref={textAreaRef}
              placeholder={LanguageManager.languageMap.get('SupportPlaceholder')}
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
                  text={LanguageManager.languageMap.get('Send')}
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
