import React from 'react'
import { observer } from 'mobx-react'
import List from '@material-ui/core/List'
import { DocumentComponent } from '../../Home/Hierarchy/Document/DocumentComponent'

import FileSystemManager from '../../../manager/Home/Hierarchy/HierarchyManager'

export const FileList: React.FC<{
  }> = observer(() => {
      //   if (!FileSystemManager.documents) {
      //       return <></>
      //   }
      return (
          <List
              component="nav"
              aria-labelledby="nested-list-subheader"
          >
              {/* {
                  FileSystemManager.documents.map(info => {
                      return <DocumentComponent key={Math.random()} document={info} depth={0}/>
                  })
              } */}
              <div id='moved-location-viewer' className='MuiListItem-root' style={{ backgroundColor: '#333333', visibility: 'hidden' }} ></div>
              <div style={{ width: '100%', height: 200 }} ></div>
          </List>
      )
  })