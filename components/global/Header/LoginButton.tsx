import React from 'react'
import { observer } from 'mobx-react'
import UserManager from '../../../manager/UserManager'
import { Button } from '@material-ui/core'
import { useRouter } from 'next/router'
import GlobalManager from '../../../manager/GlobalManager'
import RoutingManager, { Page } from '../../../manager/RoutingManager'

export const LoginButton: React.FC<{
  }> = observer(() => {
      const router = useRouter()
      if (UserManager.isUserAuthorized) {
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
