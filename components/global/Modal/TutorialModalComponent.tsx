import React from 'react'
import { observer } from 'mobx-react'
import { CustomModal } from '../../utils/CustomModal'
import ModalManager, { Modal } from '../../../manager/global/ModalManager'
import { Tabs } from 'antd'
import { BlogTutorialComponent } from './Tutorial/BlogTutorialComponent'
import { EditingTutorialComponent } from './Tutorial/EditingTutorialComponent'
import { PageControlTutorialComponent } from './Tutorial/PageControlTutorialComponent'
import TutorialManager from '../../../manager/global/TutorialManager'

const TabPane = Tabs.TabPane

export const TutorialModalComponent: React.FC<{
}> = observer(() => {
    return <CustomModal
        className={'tutorial-modal'}
        title={'사용 방법'}
        onCancel={() => {
            TutorialManager.handleClose()
        }}
        isOpen={ModalManager.map.get(Modal.Tutorial)}
        width={650}
    >
        <Tabs
            defaultActiveKey={TutorialManager.key}
            activeKey={TutorialManager.key}
            onChange={(key) => {
                TutorialManager.key = key
                TutorialManager.step = 0
            }}
        >
            <TabPane tab="블로그" key="blog">
                <BlogTutorialComponent/>
            </TabPane>
            <TabPane tab="페이지 작성하기" key="editing">
                <EditingTutorialComponent/>
            </TabPane>
            <TabPane tab="페이지 설정하기" key="page-control">
                <PageControlTutorialComponent/>
            </TabPane>
        </Tabs>
    </CustomModal>
})
