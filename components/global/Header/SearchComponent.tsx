import React from 'react'
import { observer } from 'mobx-react'

import { Input } from 'antd'
import RoutingManager, { Page } from '../../../manager/RoutingManager'

const { Search } = Input

export const SearchComponent: React.FC<{
  }> = observer(() => {
      const onSearch = async value => {
          RoutingManager.moveTo(Page.Search, `?q=${value}`)
      }

      return <Search className='search' placeholder="input search text" onSearch={onSearch} style={{ width: 200 }} />
  })
