import React from 'react'
import { observer } from 'mobx-react'
import { Visibility } from './Visibility'
import { LoginButton } from './LoginButton'
import { User } from './User'

export const Header: React.FC<{
  }> = observer(() => {
      return <div className='header'>
          <User/>
          <Visibility />
          <LoginButton />
          <div className='navigator'>
          </div>
      </div>
  })
