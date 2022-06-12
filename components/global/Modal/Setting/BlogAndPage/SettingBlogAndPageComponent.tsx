import React from 'react'
import { observer } from 'mobx-react'
import { Switch } from 'antd'
import { SetHeaderIconActiveDTO } from '@newturn-develop/types-molink'
import Blog from '../../../../../manager/global/Blog/Blog'

export const SettingBlogAndPageComponent: React.FC<{
}> = observer(() => {
    return <>
        <div className='switch-setting'>
            <div className={'text-container'}>
                <div
                    className={'main'}
                >
                    {'아이콘'}
                </div>
                <div
                    className={'description'}
                >
                    {'페이지를 나타내는 아이콘을 활성화합니다.'}
                </div>
            </div>
            <Switch
                checked={Blog.pageHierarchy.headerIconActive}
                onChange={async (checked) => {
                    if (checked) {

                    } else {
                        await HierarchyAPI.setBlogHeaderIconActive(new SetHeaderIconActiveDTO(UserManager.userId, false))
                    }
                }}
            />
        </div>
    </>
})
