import React from 'react'
import { observer } from 'mobx-react'
import CommentIcon from 'public/image/icon/comment.svg'
import HeartIcon from 'public/image/icon/heart.svg'
import { Thumbnail } from './Thumbnail'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { PageColumnComponentUserInfo } from './PageColumnComponentUserInfo'
import { getRelativeTime } from 'utils/getRelativeTime'

export interface PageColumnComponentInterface {
    id: string
    image?: string
    title: string
    lastEditedAt: string,
    userProfileImageUrl: string,
    userNickname: string,
    description: string,
    like: number,
    commentCount: number
}

export const PageCellComponent: React.FC<PageColumnComponentInterface> = observer((props) => {
    return <div
        className={'page-cell-component'}
        onClick={async () => {
            await RoutingManager.moveTo(Page.Blog, `/blog-name/${props.id}/page-name`)
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
            >
                {props.title}
            </div>
            <div
                className={'description'}
            >
                {props.description ? props.description : '설명이 없습니다.'}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    alignItems: 'center'
                }}
            >
                <div
                    className={'last-edited-at'}
                >
                    {props.lastEditedAt}
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        flexGrow: '1'
                    }}
                >
                    <PageColumnComponentUserInfo
                        userProfileImageUrl={props.userProfileImageUrl}
                        userNickname={props.userNickname}
                    />
                </div>
            </div>
            <div
                className={'divider'}
            />
            <div
                className={'number-container'}
            >
                <div
                    className={'container'}
                >
                    <CommentIcon/>
                    <div
                        className={'text'}
                    >
                        {props.commentCount}
                    </div>
                </div>
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
            </div>
        </div>
    </div>
})
