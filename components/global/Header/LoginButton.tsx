import React from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../manager/global/UserManager'
import { Button } from '@material-ui/core'
import GlobalManager from '../../../manager/global/GlobalManager'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'
import NewUserManager from '../../../manager/global/NewUserManager'

export const LoginButton: React.FC<{
  }> = observer(() => {
      if (NewUserManager.isUserAuthorized) {
          return <></>
      }

      const handleLoginButtonDown = () => {
          const documentId = new URLSearchParams(GlobalManager.window.location.search).get('id')
          if (documentId) {
              localStorage.setItem('document-before-login', documentId)
          }
          RoutingManager.moveTo(Page.SignIn)
      }

      return <div className='login-button-container'>
          <Button className='login-button' variant="contained" onClick={() => handleLoginButtonDown()}>
          로그인
          </Button>
      </div>
  })
