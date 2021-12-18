import { observer } from 'mobx-react'
import '../../utils/prism'
import React from 'react'
import ContentManager from '../../manager/home/ContentManager'

export const ContentForEmptyDocument: React.FC<{
  }> = observer(() => {
      if (ContentManager.openedDocument) {
          return <></>
      }
      return <p className='content-for-empty-document'>
          열려있는 문서가 없습니다.
      </p>
  })
