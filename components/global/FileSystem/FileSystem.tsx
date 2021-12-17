import React, { useState } from 'react'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import { makeStyles } from '@material-ui/core/styles'
import DirectoryManager from '../../../manager/DirectoryManager'
import { DrawerContextMenu } from './ContextMenu'
import DocumentManager from '../../../manager/DocumentManager'
import { DocumentComponent } from './DocumentComponent'

export const FileSystem: React.FC<{
  }> = observer(() => {
      const width = DirectoryManager.directoryDrawerWidth
      const useStyles = makeStyles({
          root: {
          },
          paper: {
              width
          }
      })
      const classes = useStyles()
      return (
          <>
              <Drawer
                  className='drawer'
                  variant="permanent"
                  anchor="left"
                  onContextMenu={(event) => DirectoryManager.handleRightClick(event, null)}
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
                          DocumentManager.documents.map(Document => {
                              return <DocumentComponent key={Math.random()} document={Document} depth={0}/>
                          })
                      }
                      <div style={{ width: '100%', height: 200 }} ></div>
                  </List>
              </Drawer>
          </>

      )
  })
