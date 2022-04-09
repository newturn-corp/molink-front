import React from 'react'
import { observer } from 'mobx-react'
import { MobileColumnDrawer } from '../../../utils/MobileColumeDrawer/MobileColumnDrawer'
import SupportManager from '../../../../manager/global/SupportManager'
import TextArea from 'antd/lib/input/TextArea'
import { Button } from '../../Button'
import { MobileColumnDrawerElement } from '../../../utils/MobileColumeDrawer/MobileColumnDrawerElement'
import { MobileColumnDrawerGroup } from '../../../utils/MobileColumeDrawer/MobileColumnDrawerGroup'

export const SupportDrawer: React.FC<{
}> = observer(() => {
    return (
        <MobileColumnDrawer
            className={'support-drawer'}
            open={SupportManager.isSupportDrawerOpen}
            onClose={() => {
                SupportManager.isSupportDrawerOpen = false
            }}
            backgroundColor={'#FAFAFB'}
            title={'문의하기 & 의견 보내기'}
        >
            <MobileColumnDrawerGroup>
                <MobileColumnDrawerElement
                    style={{
                        flexDirection: 'column'
                    }}
                >
                    <div
                        className={'desc'}
                    >
                        {'Molink 서비스에 대해 문의 사항이나 의견이 있으시다면 편하게 전달해주세요!\n이메일을 통해 빠른 시일 내에 답변드리겠습니다!'}
                    </div>
                    <TextArea
                        className={'support-input'}
                        placeholder={'문의사항 또는 의견을 입력해주세요.'}
                        showCount
                        value={SupportManager.content}
                        maxLength={300}
                        onChange={(e) => SupportManager.handleChange(e)}
                        autoSize={{ minRows: 4, maxRows: 10 }}
                        style={{
                            marginBottom: 15
                        }}
                    />
                    <div
                        className={'button-container'}
                    >
                        <Button
                            theme={'primary'}
                            text={'전송'}
                            style={{
                                width: 60,
                                height: 30
                            }}
                            fontSize={14}
                            onClick={() => SupportManager.handleOk()}
                        ></Button>
                    </div>
                </MobileColumnDrawerElement>
            </MobileColumnDrawerGroup>
        </MobileColumnDrawer>
    )
})
