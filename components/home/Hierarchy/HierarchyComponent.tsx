import React from 'react'
import { observer } from 'mobx-react'
import List from '@material-ui/core/List'
import { DocumentComponent } from './Document/DocumentComponent'

import DocumentHierarchyManager from '../../../manager/Home/DocumentHierarchyManager/DocumentHierarchyManager'

export const HierarchyComponent: React.FC<{
  }> = observer(() => {
      return (
          <List
              component="nav"
              aria-labelledby="nested-list-subheader"
          >
              {
                  DocumentHierarchyManager.hierarchy.getList().map(info => {
                      return <DocumentComponent key={Math.random()} documentHierarchyBlock={info} depth={0}/>
                  })
              }
              <div id='moved-location-viewer' className='MuiListItem-root' style={{ backgroundColor: '#333333', visibility: 'hidden' }} ></div>
              <div style={{ width: '100%', height: 200 }} ></div>
          </List>
      )
  })
