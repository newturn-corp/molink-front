import { observer } from 'mobx-react'
import React from 'react'
import { Divider, List } from '@material-ui/core'
import SearchManager from '../../manager/global/SearchManager'
import { UserSearchResult } from './UserSearchResult'

export const SearchResults: React.FC<{
  }> = observer(() => {
      if (!SearchManager.searchResults) {
          return <></>
      }
      return <div className='search-result'>
          <div
              className={'search-text'}
          >{`"${SearchManager.searchText}"에 대한`}</div>
          <div
              className={'search-result-count'}
          >{`${SearchManager.searchResults.length}개의 사용자 검색 결과`}</div>
          <div
              className={'count-divider'}
          />
          <List>
              {
                  SearchManager.searchResults.length > 0
                      ? <>
                          {
                              SearchManager.searchResults.map(result => {
                                  return <>
                                      <UserSearchResult key={`user-search-result-${result.id}`} result={result} />
                                      <Divider key={`user-search-divider-${result.id}`} variant="inset" component="li" />
                                  </>
                              })
                          }
                      </>
                      : <div>{'검색 결과가 없습니다.'}</div>
              }
          </List>
      </div>
  })
