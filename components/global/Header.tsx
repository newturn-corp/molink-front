import React, { useState } from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import { Folder } from '../Folder'
import DirectoryManager from '../../manager/DirectoryManager'
import { DrawerContextMenu } from '../ContextMenu'
import MainStore from '../../stores/MainStore'

export const Header: React.FC<{
  }> = observer(() => {
      return <div className='header'>

      </div>
  })
