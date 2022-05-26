import React from 'react'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'
import { HeartFilled } from '@ant-design/icons'
import CommentIcon from 'public/image/icon/comment.svg'
import HeartIcon from 'public/image/icon/heart.svg'
import { Thumbnail } from '../Blog/Page/Thumbnail'
import { PageColumnComponentUserInfo } from '../Blog/Page/PageColumnComponentUserInfo'

export interface PageColumnComponentInterface {
    id: string
    image?: string
    title: string
    lastEditedAt: string,
    userProfileImageUrl: string,
    userNickname: string,
    description: string,
    like: number
}

export const PageColumnComponent: React.FC<PageColumnComponentInterface> = observer((props) => {
    return <div
        className={'page-column-component'}
        onClick={async () => {
            await RoutingManager.moveWithoutAddHistory(Page.Blog, `/${props.id}`)
        }}
    >
        <Thumbnail
            title={props.title}
            image={props.image}
        />
        <div
            className={'text-container'}
        >
            <div
                className={'title'}
            >{props.title}</div>
            <div
                className={'last-edited-at'}
            >{props.lastEditedAt}</div>
            <PageColumnComponentUserInfo
                userProfileImageUrl={props.userProfileImageUrl}
                userNickname={props.userNickname}
            />
            <div
                className={'description'}
            >
                {props.description ? props.description : '설명이 없습니다.'}
            </div>
            <div
                className={'number-container'}
            >
                <div
                    className={'container'}
                >
                    <HeartIcon/>
                    <div
                        className={'text'}
                    >
                        {props.like}
                    </div>
                </div>
                <div
                    className={'container'}
                >
                    <CommentIcon/>
                    <div
                        className={'text'}
                    >
                        {0}
                    </div>
                </div>
            </div>
        </div>
    </div>
})
