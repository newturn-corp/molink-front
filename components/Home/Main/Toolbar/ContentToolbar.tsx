import { observer } from 'mobx-react'
import React from 'react'
import HierarchyManager from '../../../../manager/global/Hierarchy/HierarchyManager'
import EditorManager from '../../../../manager/Blog/EditorManager'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import { ToolbarOnOffButton } from './ToolbarOnOffButton'
import ToolbarManager from '../../../../manager/Editing/ToolbarManager'
import { ToolbarEditingButton } from './ToolbarEditingButton'
import Photo from '../../../../public/image/icon/photo.svg'
import Video from '../../../../public/image/icon/video.svg'
import Link from '../../../../public/image/icon/link.svg'
import File from '../../../../public/image/icon/folder.svg'
import Calendar from '../../../../public/image/icon/calendar.svg'
import Code from '../../../../public/image/icon/code.svg'
import Table from '../../../../public/image/icon/table.svg'
import CheckList from '../../../../public/image/icon/check-list.svg'
import {
    BookRounded,
    FormatAlignCenterRounded,
    FormatAlignJustifyRounded,
    FormatAlignLeftRounded,
    FormatAlignRightRounded,
    FormatBoldRounded,
    FormatItalicRounded,
    FormatUnderlinedRounded,
    FormatListBulletedRounded,
    FormatListNumberedRounded
} from '@material-ui/icons'
import FormattingManager, { Align, Format, List } from '../../../../manager/Editing/FormattingManager'
import LinkManager from '../../../../manager/Editing/Link/LinkManager'
import LanguageManager from '../../../../manager/global/LanguageManager'

const defaultContentToolbarStyle = {
    height: 90,
    top: 0,
    padding: 8
}

const closeStateContentToolbarStyle = {
    height: 32,
    top: 0,
    padding: 0
}

export const ContentToolbar: React.FC<{
  }> = observer(() => {
      if (!EditorManager.editable || EditorManager.isLocked) {
          return <></>
      }
      return <div
          className={'content-toolbar'}
          style={EditorManager.isToolbarOpen ? defaultContentToolbarStyle : closeStateContentToolbarStyle}
      >
          <div
              style={{
                  display: EditorManager.isToolbarOpen ? undefined : 'none'
              }}
          >
              <div
                  className={'editing-button-group'}
              >
                  <input
                      accept='image/jpg,impge/png,image/jpeg'
                      style={{ display: 'none' }}
                      id="image-insert-button"
                      multiple
                      onChange={(event) => ToolbarManager.insertImage(event)}
                      type="file"
                  />
                  <label htmlFor={'image-insert-button'}>
                      <ToolbarEditingButton
                          size={'standard'}
                          icon={<Photo/>}
                          text={LanguageManager.languageMap.Image}
                          desc={LanguageManager.languageMap.AddImage}
                          onClick={() => {}}
                          disabled={false}
                      />
                  </label>
                  <input
                      accept='video/*,audio/*'
                      style={{ display: 'none' }}
                      id="video-insert-button"
                      multiple
                      onChange={(event) => ToolbarManager.insertVideo(event)}
                      type="file"
                  />
                  <label htmlFor={'video-insert-button'}>
                      <ToolbarEditingButton
                          size={'standard'}
                          icon={<Video/>}
                          text={LanguageManager.languageMap.Video}
                          desc={LanguageManager.languageMap.AddVideo}
                          onClick={() => {}}
                          disabled={false}
                      />
                  </label>
                  <input
                      accept='*/*'
                      style={{ display: 'none' }}
                      id="file-insert-button"
                      multiple
                      onChange={(event) =>
                          ToolbarManager.insertFile(event)}
                      type="file"
                  />
                  <label htmlFor={'file-insert-button'}>
                      <ToolbarEditingButton
                          size={'standard'}
                          icon={<File/>}
                          text={LanguageManager.languageMap.File}
                          desc={LanguageManager.languageMap.AddFile}
                          onClick={() => {}}
                          disabled={false}
                      />
                  </label>
                  <ToolbarEditingButton
                      size={'standard'}
                      icon={<BookRounded/>}
                      text={LanguageManager.languageMap.Bookmark}
                      desc={LanguageManager.languageMap.AddBookmark}
                      onClick={() => LinkManager.modal.open()}
                      disabled={false}
                  />
                  {/* <ToolbarEditingButton */}
                  {/*     size={'standard'} */}
                  {/*     icon={<Calendar/>} */}
                  {/*     text={'일정'} */}
                  {/*     desc={'일정 추가'} */}
                  {/*     onClick={() => {}} */}
                  {/*     disabled={true} */}
                  {/* /> */}
                  <ToolbarEditingButton
                      size={'standard'}
                      icon={<Code/>}
                      text={'코드'}
                      desc={'코드 추가'}
                      onClick={() => ToolbarManager.insertCode()}
                      disabled={false}
                  />
                  {/* <ToolbarEditingButton */}
                  {/*     size={'standard'} */}
                  {/*     icon={<Table/>} */}
                  {/*     text={'표'} */}
                  {/*     desc={'표 추가'} */}
                  {/*     onClick={() => {}} */}
                  {/*     disabled={true} */}
                  {/* /> */}
              </div>
              <div
                  className={'divider'}
              />
              <div
                  className={'editing-button-group'}
                  style={{
                      height: 28
                  }}
              >
                  <ToolbarEditingButton
                      size={'small'}
                      icon={<FormatBoldRounded
                          style={{
                              fill: FormattingManager.formatActiveMap.get(Format.Bold) ? '#0094FF' : '#6C7177'
                          }}
                      />}
                      desc={LanguageManager.languageMap.Bold}
                      onClick={() => FormattingManager.toggleFormat(Format.Bold)}
                  />
                  <ToolbarEditingButton
                      size={'small'}
                      icon={<FormatItalicRounded
                          style={{
                              fill: FormattingManager.formatActiveMap.get(Format.Italic) ? '#0094FF' : '#6C7177'
                          }}
                      />}
                      desc={LanguageManager.languageMap.Italic}
                      onClick={() => FormattingManager.toggleFormat(Format.Italic)}
                  />
                  <ToolbarEditingButton
                      size={'small'}
                      icon={<FormatUnderlinedRounded
                          style={{
                              fill: FormattingManager.formatActiveMap.get(Format.Underline) ? '#0094FF' : '#6C7177'
                          }}
                      />}
                      desc={LanguageManager.languageMap.Underline}
                      onClick={() => FormattingManager.toggleFormat(Format.Underline)}
                  />
                  <div className={'vertical-divider'}/>
                  <ToolbarEditingButton
                      size={'small'}
                      icon={<FormatAlignLeftRounded
                          style={{
                              fill: FormattingManager.alignMap.get(Align.Left) ? '#0094FF' : '#6C7177'
                          }}
                      />}
                      desc={LanguageManager.languageMap.AlignLeft}
                      onClick={() => FormattingManager.toggleAlign(Align.Left)}
                  />
                  <ToolbarEditingButton
                      size={'small'}
                      icon={<FormatAlignCenterRounded
                          style={{
                              fill: FormattingManager.alignMap.get(Align.Center) ? '#0094FF' : '#6C7177'
                          }}
                      />}
                      desc={LanguageManager.languageMap.AlignCenter}
                      onClick={() => FormattingManager.toggleAlign(Align.Center)}
                  />
                  <ToolbarEditingButton
                      size={'small'}
                      icon={<FormatAlignRightRounded
                          style={{
                              fill: FormattingManager.alignMap.get(Align.Right) ? '#0094FF' : '#6C7177'
                          }}
                      />}
                      desc={LanguageManager.languageMap.AlignRight}
                      onClick={() => FormattingManager.toggleAlign(Align.Right)}
                  />
                  <ToolbarEditingButton
                      size={'small'}
                      icon={<FormatAlignJustifyRounded
                          style={{
                              fill: FormattingManager.alignMap.get(Align.Justify) ? '#0094FF' : '#6C7177'
                          }}
                      />}
                      desc={LanguageManager.languageMap.AlignJustify}
                      onClick={() => FormattingManager.toggleAlign(Align.Justify)}
                  />
                  <div className={'vertical-divider'}/>
                  <ToolbarEditingButton
                      size={'small'}
                      icon={<FormatListBulletedRounded
                          style={{
                              fill: FormattingManager.listMap.get(List.Dot) ? '#0094FF' : '#6C7177'
                          }}
                      />}
                      desc={LanguageManager.languageMap.UnorderedList}
                      onClick={() => FormattingManager.toggleList(List.Dot)}
                  />
                  <ToolbarEditingButton
                      size={'small'}
                      icon={<FormatListNumberedRounded
                          style={{
                              fill: FormattingManager.listMap.get(List.Number) ? '#0094FF' : '#6C7177'
                          }}
                      />}
                      desc={LanguageManager.languageMap.OrderedList}
                      onClick={() => FormattingManager.toggleList(List.Number)}
                  />
                  <ToolbarEditingButton
                      size={'small'}
                      icon={<CheckList
                          style={{
                              fill: FormattingManager.listMap.get(List.Check) ? '#0094FF' : '#6C7177'
                          }}
                      />}
                      desc={LanguageManager.languageMap.CheckList}
                      onClick={() => FormattingManager.toggleList(List.Check)}
                  />
              </div>
          </div>
          <ToolbarOnOffButton/>
      </div>
  })
