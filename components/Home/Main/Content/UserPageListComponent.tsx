import { observer } from 'mobx-react'
import React, { useEffect } from 'react'
import BlogManager from '../../../../manager/Blog/BlogManager'
import { PageColumnComponent } from '../../../global/PageColumnComponent'
import { ESUser } from '@newturn-develop/types-molink'
import moment from 'moment-timezone'
import { Pagination } from '@material-ui/lab'

export const UserPageListComponent: React.FC<{
  }> = observer(() => {
      return <div className={'page-list-container'}>
          <div className={'list-title'}>{'최근 페이지 목록'}</div>
          {
              BlogManager.userPageList.pageSummaryList.map(summary => {
                  const userInfo = BlogManager.userPageList.userMap[summary.userId] as ESUser
                  return <PageColumnComponent
                      key={`page-column-component-${summary.id}`}
                      id={summary.id}
                      title={summary.title}
                      userNickname={userInfo.nickname}
                      userProfileImageUrl={userInfo.profileImageUrl}
                      lastEditedAt={moment(summary.lastEditedAt).format('YYYY.MM.DD')}
                      description={summary.description}
                      image={summary.image}
                  />
              })
          }
          <div
              className={'pagination'}
          >
              <Pagination
                  count={Math.ceil(BlogManager.userPageList.totalPageCount / 5)}
                  page={BlogManager.userPageList.currentListOrder + 1}
                  onChange={(event, newOrder) => {
                      BlogManager.userPageList.handlePageListChange(event, newOrder - 1)
                  }}
                  showFirstButton
                  showLastButton
              />
          </div>
      </div>
  })
