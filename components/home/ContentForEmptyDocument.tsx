import { observer } from 'mobx-react'
import '../../utils/prism'
import React from 'react'
import ContentManager from '../../manager/ContentManager'
import UserManager from '../../manager/global/UserManager'
import OnlineManager from '../../manager/Editing/Online/OnlineManager'

export const ContentForEmptyDocument: React.FC<{
  }> = observer(() => {
      if (OnlineManager.openedDocument || UserManager.isAuthorizing || !UserManager.isUserAuthorized) {
          return <></>
      }
      return <p className='content-for-empty-document'>
          열려있는 문서가 없습니다.
      </p>
  })
