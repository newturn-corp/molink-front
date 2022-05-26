import React from 'react'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'

export interface PageColumnComponentUserInfoInterface {
    userProfileImageUrl: string,
    userNickname: string,
}

export const PageColumnComponentUserInfo: React.FC<PageColumnComponentUserInfoInterface> = observer((props) => {
    return <div
        className={'user-container'}
        onClick={(event) => {
            event.stopPropagation()
            RoutingManager.moveTo(Page.Blog, `/${props.userNickname}`)
        }}
    >
        <img
            className={'profile-image'}
            src={props.userProfileImageUrl}
            width={20}
        />
        <div
            className={'nickname'}
        >
            {props.userNickname}
        </div>
    </div>
})
