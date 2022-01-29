import React from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import { HierarchyContextMenu } from '../../home/Hierarchy/HierarchyContextMenu'
import { DragIndicator } from '../../home/Hierarchy/DragIndicator'
import { FileList } from './FileList'

import FileSystemManager from '../../../manager/Home/HierarchyManager/HierarchyManager'

export const FileSystem: React.FC<{
  }> = observer(() => {
      //   const width = FileSystemManager.fileSystemWidth + 1
      //   const useStyles = makeStyles({
      //       root: {
      //       },
      //       paper: {
      //           width
      //       }
      //   })
      //   const classes = useStyles()
      //   if (!FileSystemManager.documents) {
      //       return <></>
      //   }
      return (
          <>
              <Drawer
                  id='filesystem'
                  className='drawer'
                  variant="permanent"
                  anchor="left"
                  onContextMenu={(event) => FileSystemManager.handleRightClick(event, null)}
                  //   style={{
                  //       width
                  //   }}
                  //   classes={classes}
              >
                  {/* <DrawerContextMenu/> */}
                  <FileList/>
                  <DragIndicator></DragIndicator>
              </Drawer>
          </>
      )
  })
