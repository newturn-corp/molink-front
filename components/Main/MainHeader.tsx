import { observer } from 'mobx-react'
import React from 'react'
import { ESUser } from '@newturn-develop/types-molink'
import moment from 'moment-timezone'
import BlogManager from '../../manager/Blog/BlogManager'
import { PageColumnComponent } from '../global/PageColumnComponent'
import { Tooltip } from 'antd'

export const MainHeader: React.FC<{
}> = observer(() => {
    return <div className={'main-header'}>
        <div className={'category-container'}>
            <div
                className={'category active-category'}
            >전체</div>
            <Tooltip
                title={'현재 이 기능은 사용할 수 없습니다.'}
                placement={'bottom'}
                trigger={'hover'}
            >
                <div
                    className={'category'}
                >팔로우</div>
            </Tooltip>
            <Tooltip
                title={'현재 이 기능은 사용할 수 없습니다.'}
                placement={'bottom'}
                trigger={'hover'}
            >
                <div
                    className={'category'}
                >뉴스</div>
            </Tooltip>
        </div>
    </div>
})
