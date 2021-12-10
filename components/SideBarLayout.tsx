import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { observer } from 'mobx-react'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import { File } from './File'
import { Folder } from './Folder'
import MainStore from '../stores/MainStore'

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: drawerWidth
    },
    nested: {
        paddingLeft: theme.spacing(4)
    },
    collapseItemText: {
        fontSize: '0.5rem'
    }
}))

export const SidebarLayout: React.FC<{
    fullContent?: boolean
  }> = observer(() => {
      const classes = useStyles()
      return (
          <Drawer
              className='drawer'
              variant="permanent"
              anchor="left"
          >
              <List
                  component="nav"
                  aria-labelledby="nested-list-subheader"
                  className={classes.root}
              >
                  {
                      MainStore.documents.map(document => {
                          if (document.children.length > 0) {
                              return <Folder key={Math.random()} document={document} depth={0}/>
                          } else {
                              return <File key={Math.random()} document={document} depth={0}/>
                          }
                      })
                  }
              </List>
          </Drawer>
      )
  })
