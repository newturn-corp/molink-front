import { observer } from 'mobx-react'
import React from 'react'
import { ESUser } from '@newturn-develop/types-molink'
import { UserInfoProfileComponent } from './UserInfoProfileComponent'
import { UserInfoMainComponent } from './UserInfoMainComponent'
import UserPage from '../../manager/User/UserPage'

export const UserInfoComponent: React.FC<{}> = observer((props) => {
    const biography = UserPage.info.biography
    return <>
        <div
            className={'user-info'}
        >
            <UserInfoProfileComponent/>
            <div
                className={'text-container'}
            >
                <UserInfoMainComponent/>
                {/* <BlogUserInfoFollowAndPage/> */}
                <div
                    className={'biography-container'}
                >
                    {!biography || biography === '' ? '소개가 없습니다.' : biography}
                </div>
            </div>
        </div>
    </>
})
