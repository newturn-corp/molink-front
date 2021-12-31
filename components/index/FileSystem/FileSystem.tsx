import React from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import { DrawerContextMenu } from './ContextMenu'
import { DocumentComponent } from './Document/DocumentComponent'
import { DragIndicator } from './DragIndicator'

import FileSystemManager from '../../../manager/FileSystemManager'

export const FileSystem: React.FC<{
  }> = observer(() => {
      const width = FileSystemManager.directoryDrawerWidth + 1
      const useStyles = makeStyles({
          root: {
          },
          paper: {
              width
          }
      })
      const classes = useStyles()
      if (!FileSystemManager.documents) {
          return <></>
      }
      return (
          <>
              <Drawer
                  id='filesystem'
                  className='drawer'
                  variant="permanent"
                  anchor="left"
                  onContextMenu={(event) => FileSystemManager.handleRightClick(event, null)}
                  style={{
                      width
                  }}
                  classes={classes}
              >
                  <DrawerContextMenu/>
                  <List
                      component="nav"
                      aria-labelledby="nested-list-subheader"
                  >
                      {
                          FileSystemManager.documents.map(info => {
                              return <DocumentComponent key={Math.random()} document={info} depth={0}/>
                          })
                      }
                      <div id='moved-location-viewer' className='MuiListItem-root' style={{ backgroundColor: '#333333', visibility: 'hidden' }} ></div>
                      <div style={{ width: '100%', height: 200 }} ></div>
                  </List>
                  <DragIndicator></DragIndicator>
              </Drawer>
          </>
      )
  })
