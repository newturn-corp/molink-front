import React from 'react'
import { observer } from 'mobx-react'
import Document from '../domain/Document'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles } from '@material-ui/core'

export const File: React.FC<{
    document: Document,
    depth: number
  }> = observer(({ document, depth }) => {
      const useStyles = makeStyles((theme) => ({
          nested: {
              paddingLeft: theme.spacing(3.6 + depth * 2)
          }
      }))
      const classes = useStyles()
      return (
          <>
              <ListItem button className={classes.nested}>
                  <ListItemText primary={document.title} />
              </ListItem>
          </>
      )
  })
