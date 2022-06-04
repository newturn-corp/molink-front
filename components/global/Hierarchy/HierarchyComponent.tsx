import React from 'react'
import { observer } from 'mobx-react'
import List from '@material-ui/core/List'
import { PageComponent } from './Page/PageComponent'
import Blog from '../../../manager/global/Blog/Blog'

export const HierarchyComponent: React.FC<{
  }> = observer(() => {
      const pageHierarchy = Blog.pageHierarchy
      return (
          <List
              component="nav"
              aria-labelledby="nested-list-subheader"
              style={{
                  overflowX: 'hidden',
                  overflowY: 'auto',
                  marginTop: 5
              }}
          >
              {
                  pageHierarchy.topLevelDocumentIdList.map(pageID => {
                      return <PageComponent
                          key={`page-${pageID}`}
                          pageID={pageID}
                          depth={0}
                      />
                  })
              }
              <div
                  id="moved-location-viewer"
                  className="MuiListItem-root"
                  style={{
                      backgroundColor: '#333333',
                      visibility: 'hidden'
                  }}
              />
              <div
                  id={'hierarchy-margin'}
                  style={{
                      width: '100%',
                      height: 250
                  }}
                  onDragOver={() => pageHierarchy.pageDragManager.handleDragOverHierarchyMargin()}
              />
          </List>
      )
  })
