import React from 'react'
import { observer } from 'mobx-react'

import { Input } from 'antd'
import RoutingManager, { Page } from '../../../manager/global/RoutingManager'

const { Search } = Input

export const SearchComponent: React.FC<{
  }> = observer(() => {
      const onSearch = async value => {
          await RoutingManager.moveTo(Page.SearchUser, `?q=${value}`)
      }

      return <div
          className={'search-container'}
      >
          <Search
              className='search'
              placeholder="현재 사용자만 검색할 수 있습니다."
              onSearch={onSearch}
              style={{
                  width: 360
              }}
          />
      </div>
  })
