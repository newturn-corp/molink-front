import { observer } from 'mobx-react'
import '../../utils/prism'
import React from 'react'
import HoveringToolbarManager from '../../manager/HoveringToolbarManager'
import { CircularProgress, TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import LinkManager, { LinkOption } from '../../manager/LinkManager'
import isUrl from 'is-url'

export const LinkInput: React.FC<{
  }> = observer(() => {
      if (!LinkManager.isShowLinkInput) {
          return <></>
      }

      return <div className='link-input-background'
          onClick={() => {
              LinkManager.closeLinkInput()
          }}>
          <div
              className='link-input'
              style={{
                  opacity: 1,
                  top: LinkManager.selectionRect.top + window.pageYOffset - 50 + 90,
                  left: LinkManager.selectionRect.left + window.pageXOffset - 300 / 2 + LinkManager.selectionRect.width / 2
              }}
              onClick={(e) => e.stopPropagation()}
          >
              <Autocomplete
                  disableClearable
                  popupIcon={<></>}
                  freeSolo={true}
                  loading={LinkManager.isSearching}
                  options={LinkManager.options}
                  filterOptions={o => o}
                  groupBy={(option) => option.reference}
                  getOptionLabel={(option) => option.text ? option.text : ''}
                  onInputChange={(e, value) => LinkManager.handleInputChange(value)}
                  onChange={(e, value: LinkOption) => LinkManager.handleChange(value)}
                  noOptionsText={isUrl(LinkManager.currentInputValue) ? '이 링크로 연결' : '선택된 문서가 없습니다.'}
                  //   getOptionSelected={(option, value) => option.text}
                  renderInput={(params) =>
                      <TextField {...params}
                          placeholder='문서 제목 또는 링크 입력'
                          variant="outlined"
                          onKeyDown={(event) => {
                              if (event.key === 'Enter') {
                                  LinkManager.handleEnter()
                              }
                          }}
                          InputProps={{
                              ...params.InputProps,
                              endAdornment: (
                                  <React.Fragment>
                                      {LinkManager.isSearching ? <CircularProgress color="inherit" size={20} /> : null}
                                      {params.InputProps.endAdornment}
                                  </React.Fragment>
                              )
                          }}
                      />}
              />
          </div>
      </div>
  })
