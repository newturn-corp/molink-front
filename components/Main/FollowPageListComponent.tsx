import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import { ESUser } from '@newturn-develop/types-molink'
import moment from 'moment-timezone'
import BlogManager from '../../manager/Blog/BlogManager'
import { PageColumnComponent } from '../global/PageColumnComponent'
import { useInView } from 'react-intersection-observer'
import { FollowPageList } from '../../manager/Blog/FollowPageList'
import { CircularProgress } from '@material-ui/core'

export const FollowPageListComponent: React.FC<{
}> = observer(() => {
    const [loading, setLoading] = useState(false)
    const [ref, inView] = useInView()
    const [page, setPage] = useState(1)

    // 서버에서 아이템을 가지고 오는 함수
    const getItems = useCallback(async () => {
        setLoading(true)
        await BlogManager.followPageList.loadPageSummaryList()
        setLoading(false)
    }, [page])

    useEffect(() => {
        getItems()
    }, [getItems])

    useEffect(() => {
        if (inView && !loading && !BlogManager.followPageList.listEnded) {
            setPage(prevState => prevState + 1)
        }
    }, [inView, loading])

    return <div
        className={'page-list-container follow-page-list-container'}
        onScroll={(event) => {
        }}
    >
        <div
            style={{
                margin: '0 auto',
                width: 'fit-content'
            }}
        >
            {
                BlogManager.followPageList.pageSummaryList.map((summary, index) => {
                    const userInfo = BlogManager.followPageList.userMap[summary.userId] as ESUser
                    return <div
                        key={`page-column-component-container-${summary.id}`}
                        ref={index === BlogManager.followPageList.pageSummaryList.length - 1 ? ref : undefined}
                    >
                        <PageColumnComponent
                            key={`page-column-component-${summary.id}`}
                            id={summary.id}
                            title={summary.title}
                            userNickname={userInfo.nickname}
                            userProfileImageUrl={userInfo.profileImageUrl}
                            lastEditedAt={moment(summary.lastEditedAt).format('YYYY.MM.DD')}
                            description={summary.description}
                            image={summary.image}
                            like={summary.like}
                            commentCount={summary.commentCount}
                        />
                    </div>
                })
            }
            {
                loading ? <CircularProgress/> : <></>
            }
        </div>
    </div>
})
