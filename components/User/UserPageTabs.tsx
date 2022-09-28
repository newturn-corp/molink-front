import { observer } from 'mobx-react'
import React from 'react'
import UserPage from '../../manager/User/UserPage'
import { PageListComponent } from '../global/PageList/PageListComponent'
import { PageListViewType } from '../../Enums/PageListViewType'
import { Tabs } from 'antd'
import { UserBlogsTab } from './UserBlogsTab'
const TabPane = Tabs.TabPane

export const UserPageTabs: React.FC<{
}> = observer(() => {
    const userPageList = UserPage.pageList
    return <div
        className={'user-page-tabs-container'}
    >
        <Tabs
            defaultActiveKey="1"
            centered
            size={'large'}
        >
            <TabPane tab="글" key="1">
                <PageListComponent
                    pageSummaryList={userPageList.pageSummaryList}
                    isListEnded={userPageList.listEnded}
                    onLoadPageList={async () => {
                        await userPageList.loadPageSummaryList()
                    }}
                    viewType={PageListViewType.List}
                />
            </TabPane>
            <TabPane tab="블로그" key="2">
                <UserBlogsTab/>
            </TabPane>
            {/* <TabPane tab="팔로잉" key="3"> */}
            {/*     Content of Tab Pane 3 */}
            {/* </TabPane> */}
        </Tabs>

    </div>
})
