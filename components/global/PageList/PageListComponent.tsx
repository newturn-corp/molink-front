import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useState } from 'react'
import { ESPageSummary, ESUser } from '@newturn-develop/types-molink'
import { useInView } from 'react-intersection-observer'
import UserInfoMap from '../../../manager/global/User/UserInfoMap'
import { PageColumnComponent } from './PageColumnComponent'
import { CircleProgress } from '../CircleProgress'
import { getRelativeTime } from '../../../utils/getRelativeTime'
import { PageCellComponent } from './PageCellComponent'
import { PageListViewType } from '../../../Enums/PageListViewType'
import GlobalManager from '../../../manager/global/GlobalManager'
import { isBrowser } from 'react-device-detect'
import StyleManager from '../../../manager/global/Style/StyleManager'
import Blog from '../../../manager/global/Blog/Blog'

const ScrollContainer: React.FC<{
    showScroll: boolean
}> = observer((props) => {
    if (props.showScroll) {
        return <div
            className={'scroll-container'}
            style={{
                overflowY: 'scroll',
                top: 0,
                height: GlobalManager.screenHeight - StyleManager.globalStyle.header.height,
                width: GlobalManager.screenWidth - Blog.getBlogWidth()
            }}
        >
            {props.children}
        </div>
    }
    return <>{props.children}</>
})

export const PageListComponent: React.FC<{
    pageSummaryList: ESPageSummary[],
    isListEnded: boolean
    onLoadPageList: () => Promise<void>
    viewType: PageListViewType
    showScroll?: boolean
}> = observer(({
    pageSummaryList,
    isListEnded,
    onLoadPageList,
    viewType,
    showScroll
}) => {
    const [loading, setLoading] = useState(false)
    const [ref, inView] = useInView()
    const [page, setPage] = useState(1)

    // 서버에서 아이템을 가지고 오는 함수
    const getItems = useCallback(async () => {
        setLoading(true)
        if (pageSummaryList.length > 0) {
            await onLoadPageList()
        }
        setLoading(false)
    }, [page])

    useEffect(() => {
        getItems()
    }, [getItems])

    useEffect(() => {
        if (inView && !loading && !isListEnded) {
            setPage(prevState => prevState + 1)
        }
    }, [inView, loading, isListEnded])

    const hierarchyWidth = Blog.getBlogWidth()
    const getContentContainerSize = useCallback(() => {
        if (!GlobalManager.window) {
            return 0
        }
        if (isBrowser) {
            return GlobalManager.screenWidth - hierarchyWidth
        } else {
            return GlobalManager.screenHeight
        }
    }, [GlobalManager.screenWidth, GlobalManager.screenHeight, hierarchyWidth])

    const getListContainerSize = useCallback(() => {
        const size = getContentContainerSize()
        if (size > 1760) {
            return 1760
        } else if (size > 1420) {
            return 1420
        } else if (size > 1080) {
            return 1080
        } else {
            return 1020
        }
    }, [getContentContainerSize()])

    return <ScrollContainer showScroll={showScroll}>
        <div
            className={'page-list-container'}
            style={{
                width: viewType === PageListViewType.Table ? getListContainerSize() : undefined
            }}
        >
            <div
                style={{
                    margin: viewType === PageListViewType.Table ? '30px' : '0 auto',
                    marginTop: '24px',
                    display: viewType === PageListViewType.Table ? 'flex' : undefined,
                    flexWrap: viewType === PageListViewType.Table ? 'wrap' : undefined
                }}
            >
                {
                    viewType === PageListViewType.List
                        ? pageSummaryList.map((summary, index) => {
                            const userInfo = UserInfoMap.idMap[summary.userId] as ESUser
                            return <div
                                key={`page-column-component-container-${summary.id}-${index}`}
                                ref={index === pageSummaryList.length - 1 ? ref : undefined}
                            >
                                <PageColumnComponent
                                    key={`page-column-component-${summary.id}-${index}`}
                                    id={summary.id}
                                    title={summary.title}
                                    userNickname={userInfo.nickname}
                                    userProfileImageUrl={userInfo.profileImageUrl}
                                    lastEditedAt={getRelativeTime(new Date(summary.lastEditedAt), true)}
                                    description={summary.description}
                                    image={summary.image}
                                    like={summary.like}
                                    commentCount={summary.commentCount}
                                />
                            </div>
                        })
                        : pageSummaryList.map((summary, index) => {
                            const userInfo = UserInfoMap.idMap[summary.userId] as ESUser
                            return <div
                                key={`page-cell-component-container-${summary.id}-${index}`}
                                ref={index === pageSummaryList.length - 1 ? ref : undefined}
                            >
                                <PageCellComponent
                                    key={`page-cell-component-${summary.id}-${index}`}
                                    id={summary.id}
                                    title={summary.title}
                                    userNickname={userInfo.nickname}
                                    userProfileImageUrl={userInfo.profileImageUrl}
                                    lastEditedAt={getRelativeTime(new Date(summary.lastEditedAt), true)}
                                    description={summary.description}
                                    image={summary.image}
                                    like={summary.like}
                                    commentCount={summary.commentCount}
                                />
                            </div>
                        })
                }
                <CircleProgress
                    visible={loading}
                />
            </div>
        </div>
    </ScrollContainer>
})
