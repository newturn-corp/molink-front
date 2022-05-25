import { observer } from 'mobx-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { PageColumnComponent } from '../../../global/PageColumnComponent'
import { ESUser } from '@newturn-develop/types-molink'
import moment from 'moment-timezone'
import { Pagination } from '@material-ui/lab'
import BlogPage from '../../../../manager/Blog/BlogPage'
import { useInView } from 'react-intersection-observer'
import BlogManager from '../../../../manager/Blog/BlogManager'
import { CircularProgress } from '@material-ui/core'

export const UserPageListComponent: React.FC<{
  }> = observer(() => {
      const [loading, setLoading] = useState(false)
      const [ref, inView] = useInView({
          threshold: 0
      })
      const [page, setPage] = useState(1)

      // 서버에서 아이템을 가지고 오는 함수
      const getItems = useCallback(async () => {
          setLoading(true)
          if (BlogPage.blog) {
              console.log('나 호출!!!')
              await BlogPage.blog.userPageList.loadPageSummaryList()
          }
          setLoading(false)
      }, [page])

      useEffect(() => {
          getItems()
      }, [getItems])

      useEffect(() => {
          if (inView && !loading && !userPageList.listEnded) {
              console.log('page 증가')
              setPage(prevState => prevState + 1)
          }
      }, [inView])

      const blog = BlogPage.blog
      if (!blog) {
          return <></>
      }
      const userPageList = blog.userPageList

      return <div
          className={'page-list-container'}
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
                  userPageList.pageSummaryList.map((summary, index) => {
                      const userInfo = userPageList.userMap[summary.userId] as ESUser
                      return <div
                          key={`page-column-component-container-${summary.id}`}
                          ref={index === userPageList.pageSummaryList.length - 1 ? ref : undefined}
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
