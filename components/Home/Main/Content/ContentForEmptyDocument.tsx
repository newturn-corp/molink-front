import { observer } from 'mobx-react'
import React from 'react'

export const ContentForEmptyDocument: React.FC<{
  }> = observer(() => {
      return <p className='content-for-empty-document'>
          열려있는 문서가 없습니다.
      </p>
  })
