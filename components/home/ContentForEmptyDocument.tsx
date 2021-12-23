import { observer } from 'mobx-react'
import '../../utils/prism'
import React from 'react'
import ContentManager from '../../manager/ContentManager'
import UserManager from '../../manager/UserManager'

export const ContentForEmptyDocument: React.FC<{
  }> = observer(() => {
      if (ContentManager.openedDocument || ContentManager.isLoadingContent || UserManager.isAuthorizing || !UserManager.isUserAuthorized) {
          return <></>
      }
      return <p className='content-for-empty-document'>
          열려있는 문서가 없습니다.
      </p>
  })
