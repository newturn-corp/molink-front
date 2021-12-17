import React from 'react'
import { observer } from 'mobx-react'
import AuthManager from '../../manager/AuthManager'

export const Header: React.FC<{
  }> = observer(() => {
      return <div className='header'>
          <div className='sign-out' onClick={() => {
              AuthManager.signOut()
          }}>로그아웃</div>
      </div>
  })
