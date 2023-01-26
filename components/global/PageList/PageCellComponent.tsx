import React from 'react'
import { observer } from 'mobx-react'
import CommentIcon from 'public/image/icon/comment.svg'
import HeartIcon from 'public/image/icon/heart.svg'
import { PageThumbnailComponent } from './PageThumbnailComponent'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import { PageColumnComponentUserInfo } from './PageColumnComponentUserInfo'
import GlobalManager from '../../../manager/global/GlobalManager'

export interface PageColumnComponentInterface {
    id: string
    image?: string
    title: string
    lastEditedAt: string,
    userProfileImageUrl: string,
    userNickname: string,
    description: string,
    like: number,
    commentCount: number,
    width: number
}

export const PageCellComponent: React.FC<PageColumnComponentInterface> = observer((props) => {
    return <div
        className={'page-cell-component'}
        style={{
            minWidth: GlobalManager.isBrowser ? 320 : undefined,
            width: props.width
        }}
        onClick={async () => {
            await RoutingManager.moveTo(Page.Editor, `/${props.id}`)
        }}
    >
        <PageThumbnailComponent
            title={props.title}
            image={props.image}
            thumbnailWidth={370}
            thumbnailHeight={170}
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
