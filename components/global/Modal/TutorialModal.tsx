import React, { useState } from 'react'
import { observer } from 'mobx-react'
import { Button } from '../Button'
import { CustomModal } from '../../utils/CustomModal'
import LanguageManager from '../../../manager/global/LanguageManager'
import ModalManager from '../../../manager/global/ModalManager'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { Tabs } from 'antd'
import { TabPane } from 'rc-tabs'
import { BlogTutorialComponent } from './Tutorial/BlogTutorialComponent'
import { EditingTutorialComponent } from './Tutorial/EditingTutorialComponent'
import { PageControlTutorialComponent } from './Tutorial/PageControlTutorialComponent'

export const TutorialModal: React.FC<{
}> = observer(() => {
    const [activeKey, setActiveKey] = useState('1')

    return <CustomModal
        className={'tutorial-modal'}
        title={'사용 방법'}
        onCancel={() => {
            ModalManager.openTutorialModal = false
        }}
        isOpen={ModalManager.openTutorialModal}
        width={650}
    >
        <Tabs defaultActiveKey="1" activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
            <TabPane tab="블로그" key="1">
                <BlogTutorialComponent
                    onStepOverflow={() => setActiveKey('2')}
                />
            </TabPane>
            <TabPane tab="페이지 작성하기" key="2">
                <EditingTutorialComponent
                    onStepOverflow={() => setActiveKey('3')}
                    onStepUnderflow={() => setActiveKey('1')}
                />
            </TabPane>
            <TabPane tab="페이지 설정하기" key="3">
                <PageControlTutorialComponent
                    onStepUnderflow={() => setActiveKey('2')}
                />
            </TabPane>
        </Tabs>
    </CustomModal>
})
