import React from 'react'
import RoutingManager, { Page } from '../../manager/global/RoutingManager'

export const AuthLogo: React.FC<{
  }> = () => {
      return <img
          className='logo'
          src='/image/global/header/logo.png'
          alt='logo'
          onClick={() => {
              RoutingManager.moveTo(Page.Index)
          }}
      />
  }
