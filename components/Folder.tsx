import React from 'react'
import { observer } from 'mobx-react'
import Document from '../domain/Document'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { Collapse, makeStyles } from '@material-ui/core'
import { ExpandLess, ExpandMore } from '@material-ui/icons'
import { getIconByName } from '../infra/icon'
import { File } from './File'

export const Folder: React.FC<{
    document: Document,
    depth: number
  }> = observer(({ document, depth }) => {
      const useStyles = makeStyles((theme) => ({
          nested: {
              paddingLeft: depth ? theme.spacing(2 + depth * 2) : undefined
          }
      }))
      const classes = useStyles()

      const [open, setOpen] = React.useState(false)
      const handleClick = () => {
          setOpen(!open)
      }
      const Icon = getIconByName(document.hasIcon ? document.iconName : 'folder')
      return (
          <>
              <ListItem button onClick={handleClick} className={classes.nested}>
                  {
                      document.hasIcon
                          ? <ListItemIcon>
                              <Icon/>
                          </ListItemIcon>
                          : <></>
                  }
                  <ListItemText primary={document.title} />
                  {open ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                      {
                          document.childs.map(child => {
                              if (child.isFolder) {
                                  return <Folder key={Math.random()} document={child} depth={depth + 1}/>
                              } else {
                                  return <File key={Math.random()} document={child} depth={depth + 1}/>
                              }
                          })
                      }
                  </List>
              </Collapse>
          </>
      )
  })
