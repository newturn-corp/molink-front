import { observer } from 'mobx-react'
import React from 'react'
import { Divider, List } from '@material-ui/core'
import SearchManager from '../../manager/Search/SearchManager'
import { UserSearchResult } from './UserSearchResult'
import LanguageManager from '../../manager/global/LanguageManager'
import { ESUser } from '@newturn-develop/types-molink'

export const UserSearchResultContainer: React.FC<{
    searchText: string
  }> = observer(({ searchText }) => {
      const searchResults = SearchManager.searchEngine.searchResults
      if (!searchResults) {
          return <></>
      }
      return <div className='search-result'>
          <div
              className={'search-text'}
          >
              {`"${searchText}"${LanguageManager.languageMap.For}`}
          </div>
          <div
              className={'search-result-count'}
          >
              {`${searchResults.length}${LanguageManager.languageMap.UserSearchResultCount}`}
          </div>
          <div
              className={'count-divider'}
          />
          <List>
              {
                  searchResults.length > 0
                      ? <>
                          {
                              searchResults.map((result, index) => {
                                  return <>
                                      <UserSearchResult
                                          key={`user-search-result-${result.id}`}
                                          result={result}
                                      />
                                      {
                                          index !== searchResults.length - 1 && <Divider
                                              key={`user-search-divider-${result.id}`}
                                              variant="inset"
                                              component="li"
                                          />
                                      }
                                  </>
                              })
                          }
                      </>
                      : <div>
                          {LanguageManager.languageMap.NoSearchResult}
                      </div>
              }
          </List>
      </div>
  })
