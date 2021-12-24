import React from 'react'
import { observer } from 'mobx-react'
import { Visibility } from './Visibility'
import { LoginButton } from './LoginButton'
import { User } from './User'
import { SearchComponent } from './SearchComponent'

export const Header: React.FC<{
  }> = observer(() => {
      return <div className='header'>
          <div className='header-right'>
              <User/>
              <Visibility />
              <LoginButton />
          </div>
          <div className='navigator'>
          </div>
          <SearchComponent />
          <div className='logo'></div>
      </div>
  })
