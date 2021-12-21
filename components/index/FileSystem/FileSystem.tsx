import React from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import { DrawerContextMenu } from './ContextMenu'
import { DocumentComponent } from './Document/DocumentComponent'

import FileSystemManager from '../../../manager/renew/FileSystemManager'

export const FileSystem: React.FC<{
  }> = observer(() => {
      const width = FileSystemManager.directoryDrawerWidth
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
                      <div style={{ width: '100%', height: 200 }} ></div>
                  </List>
              </Drawer>
          </>

      )
  })
