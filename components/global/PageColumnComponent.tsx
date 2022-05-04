import React from 'react'
import { observer } from 'mobx-react'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'

export interface PageColumnComponentInterface {
    id: string
    image?: string
    title: string
    lastEditedAt: string,
    userProfileImageUrl: string,
    userNickname: string,
    description: string
}

export const PageColumnComponent: React.FC<PageColumnComponentInterface> = observer((props) => {
    return <div
        className={'page-column-component'}
        onClick={async () => {
            await RoutingManager.moveWithoutAddHistory(Page.Blog, `/${props.id}`)
        }}
    >
        <div
            className={'thumbnail'}
            style={{
                backgroundColor: props.image ? undefined : '#0094FF',
                padding: props.image ? undefined : 20
            }}
        >
            {
                props.image
                    ? <img
                        src={props.image}
                    />
                    : <div
                        className={'text'}
                    >
                        {props.title}
                    </div>
            }
        </div>
        <div
            className={'text-container'}
        >
            <div
                className={'title'}
            >{props.title}</div>
            <div
                className={'last-edited-at'}
            >{props.lastEditedAt}</div>
            <div
                className={'user-container'}
            >
                <img
                    className={'profile-image'}
                    src={props.userProfileImageUrl}
                    width={20}
                />
                <div
                    className={'nickname'}
                >{props.userNickname}</div>
            </div>
            <div
                className={'description'}
            >{props.description ? props.description : '설명이 없습니다.'}</div>
        </div>
    </div>
})
