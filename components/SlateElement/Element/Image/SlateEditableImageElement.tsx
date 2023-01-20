import React, { useCallback, useRef, useState } from 'react'
import {
    useSelected,
    useFocused,
    useSlateStatic,
    ReactEditor
} from 'slate-react'
import { css } from '@emotion/css'
import { Rnd } from 'react-rnd'
import { Editor, Path, Range, Transforms } from 'slate'
import { FormatAlignCenter, FormatAlignLeft, FormatAlignRight } from '@material-ui/icons'

import { FloatOption, SlateImageElementType, TextCategory } from '../../../../Types/slate/CustomElement'
import StyleManager from '../../../../manager/global/Style/StyleManager'
import FileUploadManager from '../../../../manager/Editing/FileUploadManager'
import MenuItem from '../../../../manager/global/Menu/MenuItem'
import EditorPage from '../../../../manager/Blog/Editor/EditorPage'
import { MediaMenuButton } from '../../Extra/MediaMenuButton'
import MenuManager from '../../../../manager/global/Menu/MenuManager'
import { Caption } from '../Caption'

const getImageSrc = (src: string, version) => {
    if (src && src.includes('https://cdn.filestackcontent.com')) {
        return src + `?policy=${FileUploadManager.policy}&signature=${FileUploadManager.signature}`
    } else if (src && src.includes('molink.life/files')) {
        return src + `?pageId=${EditorPage.pageId}&v=${version}`
    }
    return src
}

export const SlateEditableImageElement: React.FC<{
    attributes,
    children,
    element: SlateImageElementType
  }> = ({ attributes, children, element }) => {
      const selected = useSelected()
      const focused = useFocused()
      const editor = useSlateStatic()
      const [isMouseOver, setIsMouseOver] = useState(false)
      const [version, setVersion] = useState(1)
      const menuButtonRef = useRef<HTMLDivElement>()
      const currentNodePath = useCallback(() => (
          ReactEditor.findPath(editor, element)
      ), [editor, element])

      const editable = EditorPage.editor.editable
      const isSelectionCollapsed = editor.selection && Range.isCollapsed(editor.selection)
      return (
          <div
              className={'image-element'}
              onMouseOver={() => setIsMouseOver(true)}
              onMouseLeave={() => setIsMouseOver(false)}
              {...attributes}
          >
              {children}
              {
                  !element.isUploading && <div
                      contentEditable={false}
                      className={css`
                    position: relative;
                    margin: 10px;
                    width: ${StyleManager.contentStyle.main.width}px;
                    `}
                  >
                      <Rnd
                          default={{
                              x: 0,
                              y: 0,
                              width: element.width,
                              height: element.height
                          }}
                          size={{
                              width: element.width,
                              height: element.height
                          }}
                          disableDragging
                          //   enableResizing={selected && focused}
                          enableResizing={true}
                          lockAspectRatio
                          style={{
                              position: 'relative',
                              float: element.floatOption === FloatOption.Right ? 'right' : undefined,
                              marginLeft: element.floatOption === FloatOption.Center ? (StyleManager.contentStyle.main.width - element.width) / 2 : undefined,
                              transform: 'none !important',
                              display: 'block',
                              width: element.width,
                              height: element.height
                          }}
                          onResizeStop={(e, direction, ref, delta, position) => {
                              const widthStr = ref.style.width
                              const heightStr = ref.style.height
                              const width = Number(widthStr.slice(0, widthStr.length - 2))
                              const height = Number(heightStr.slice(0, heightStr.length - 2))
                              Transforms.setNodes(editor, {
                                  width,
                                  height
                              }, {
                                  at: editor.selection
                              })
                          }}
                      >
                          <figure style={{
                              width: '100%',
                              height: '100%'
                          }}>
                              <img
                                  draggable={false}
                                  src={getImageSrc(element.url, version)}
                                  onError={() => setTimeout(() => {
                                      setVersion(version * (version + 1))
                                  }, version * 50)}
                                  className={css`
                            display: block;
                            width: 100%;
                            height: 100%;
                            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
                            `}
                              />
                          </figure>
                          {
                              selected && focused && isSelectionCollapsed &&
                              <>
                                  <div
                                      className='image-adjust-button'
                                      style={{
                                          left: (element.width - 100) / 2
                                      }}>
                                      <div
                                          className={'button'}
                                          onClick={event => {
                                              Transforms.setNodes(editor, {
                                                  floatOption: FloatOption.Left
                                              }, {
                                                  at: editor.selection
                                              })
                                          }}
                                      >
                                          <FormatAlignLeft />
                                      </div>
                                      <div
                                          className={'button'}
                                          onClick={event => {
                                              Transforms.setNodes(editor, {
                                                  floatOption: FloatOption.Center
                                              }, {
                                                  at: editor.selection
                                              })
                                          }}
                                      >
                                          <FormatAlignCenter />
                                      </div>
                                      <div
                                          className={'button'}
                                          onClick={event => {
                                              Transforms.setNodes(editor, {
                                                  floatOption: FloatOption.Right
                                              }, {
                                                  at: editor.selection
                                              })
                                          }}
                                      >
                                          <FormatAlignRight />
                                      </div>
                                  </div>
                                  <div
                                      className='image-resize-dot'
                                      style={{
                                          top: -7.5,
                                          left: -7.5
                                      }}>
                                  </div>
                                  <div
                                      className='image-resize-dot'
                                      style={{
                                          top: -7.5,
                                          right: -7.5
                                      }}>
                                  </div>
                                  <div
                                      className='image-resize-dot'
                                      style={{
                                          bottom: -7.5,
                                          left: -7.5
                                      }}>
                                  </div>
                                  <div
                                      className='image-resize-dot'
                                      style={{
                                          bottom: -7.5,
                                          right: -7.5
                                      }}>
                                  </div>
                              </>
                          }
                          {
                              editable && <MediaMenuButton
                                  isShow={isMouseOver}
                                  menuItems={[new MenuItem('삭제', () => {
                                      if (editable) {
                                          Transforms.removeNodes(editor, { at: currentNodePath() })
                                      }
                                      MenuManager.close()
                                  })]}
                                  onClick={() => {
                                      Transforms.select(editor, currentNodePath())
                                  }}
                                  currentNodePath={currentNodePath()}
                              />
                          }
                      </Rnd>
                      <Caption selected={selected && isSelectionCollapsed} caption={element.caption} floatOption={element.floatOption}/>
                  </div>
              }
          </div>
      )
  }
