import React, { useRef, useState } from 'react'
import {
    useSelected,
    useFocused,
    useSlateStatic,
    ReactEditor
} from 'slate-react'
import { css } from '@emotion/css'
import { Rnd } from 'react-rnd'
import { Editor, Transforms } from 'slate'
import { FormatAlignCenter, FormatAlignLeft, FormatAlignRight } from '@material-ui/icons'

import TextArea, { TextAreaRef } from 'antd/lib/input/TextArea'
import { ImageFloatOption, SlateImageElementType, TextCategory } from '../../../Types/slate/CustomElement'
import EditorManager from '../../../manager/Blog/EditorManager'
import StyleManager from '../../../manager/global/Style/StyleManager'

const Caption: React.FC<{
    selected: boolean,
    caption: string,
    floatOption: ImageFloatOption
  }> = ({ selected, caption, floatOption }) => {
      const inputRef = useRef<TextAreaRef>(null)
      const [captionFocused, setCaptionFocused] = useState(false)
      const editor = useSlateStatic()
      const showCaption = selected || caption.length > 0
      if (!selected) {
          if (captionFocused) {
              setCaptionFocused(false)
          }
      }
      return <figcaption style={{
          display: showCaption ? undefined : 'none'
      }}>
          <TextArea
              ref={inputRef}
              className={'caption'}
              style={{
                  userSelect: captionFocused ? 'auto' : undefined,
                  textAlign: floatOption === ImageFloatOption.Left ? 'left' : floatOption === ImageFloatOption.Center ? 'center' : 'right'
              }}
              tabIndex={-1}
              onClick={() => {
                  setCaptionFocused(true)
              }}
              autoSize={true}
              placeholder='이미지 설명'
              bordered={false}
              defaultValue={caption}
              //   readOnly={!captionFocused}
              rows={1}
              onChange={(e) => {
                  Transforms.setNodes(EditorManager.slateEditor, {
                      caption: e.target.value
                  }, {
                      at: EditorManager.slateEditor.selection
                  })
              }}
              onBlur={(e) => {
                  setCaptionFocused(false)
              }}
              onKeyDown={(e) => {
                  if (e.ctrlKey) {
                      e.preventDefault()
                  }
                  if (e.key === 'ArrowDown') {
                      setCaptionFocused(false)
                      const { selection } = editor
                      if (selection.anchor.path[0] === editor.children.length - 1) {
                          Transforms.insertNodes(editor, {
                              type: 'text',
                              category: TextCategory.Content3,
                              children: [{ text: '' }]
                          })
                      }
                      inputRef.current.blur()
                      ReactEditor.focus(editor)
                      Transforms.select(editor, Editor.after(editor, editor.selection, { unit: 'line' }))
                  } else if (e.key === 'ArrowUp') {
                      setCaptionFocused(false)
                      inputRef.current.blur()
                      ReactEditor.focus(editor)
                      Transforms.select(editor, Editor.before(editor, editor.selection, {
                          distance: 1
                      }))
                  }
              }}
          />
      </figcaption>
  }

export const SlateImageElement: React.FC<{
    attributes,
    children,
    element: SlateImageElementType
  }> = ({ attributes, children, element }) => {
      const selected = useSelected()
      const focused = useFocused()
      if (element.isUploading) {
          <p>로딩 중..</p>
      }
      return (
          <div
              className={'image-element'}
              {...attributes}>
              {children}
              <div
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
                      disableDragging
                      //   enableResizing={selected && focused}
                      enableResizing={true}
                      lockAspectRatio
                      style={{
                          position: 'relative',
                          float: element.floatOption === ImageFloatOption.Right ? 'right' : undefined,
                          marginLeft: element.floatOption === ImageFloatOption.Center ? (StyleManager.contentStyle.main.width - element.width) / 2 : undefined,
                          transform: 'none !important',
                          display: 'block'
                      }}
                      onResizeStop={(e, direction, ref, delta, position) => {
                          const widthStr = ref.style.width
                          const heightStr = ref.style.height
                          const width = Number(widthStr.slice(0, widthStr.length - 2))
                          const height = Number(heightStr.slice(0, heightStr.length - 2))
                          Transforms.setNodes(EditorManager.slateEditor, {
                              width,
                              height
                          }, {
                              at: EditorManager.slateEditor.selection
                          })
                      }}
                  >
                      <figure style={{
                          width: '100%',
                          height: '100%'
                      }}>
                          <img
                              draggable={false}
                              src={element.url}
                              className={css`
                            display: block;
                            width: 100%;
                            height: 100%;
                            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
                            `}
                          />
                      </figure>
                      {
                          selected && focused
                              ? <>
                                  <div
                                      className='image-adjust-button'
                                      style={{
                                          left: (element.width - 100) / 2
                                      }}>
                                      <div
                                          className={'button'}
                                          onClick={event => {
                                              Transforms.setNodes(EditorManager.slateEditor, {
                                                  floatOption: ImageFloatOption.Left
                                              }, {
                                                  at: EditorManager.slateEditor.selection
                                              })
                                          }}
                                      >
                                          <FormatAlignLeft />
                                      </div>
                                      <div
                                          className={'button'}
                                          onClick={event => {
                                              Transforms.setNodes(EditorManager.slateEditor, {
                                                  floatOption: ImageFloatOption.Center
                                              }, {
                                                  at: EditorManager.slateEditor.selection
                                              })
                                          }}
                                      >
                                          <FormatAlignCenter />
                                      </div>
                                      <div
                                          className={'button'}
                                          onClick={event => {
                                              Transforms.setNodes(EditorManager.slateEditor, {
                                                  floatOption: ImageFloatOption.Right
                                              }, {
                                                  at: EditorManager.slateEditor.selection
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
                              : <></>
                      }
                  </Rnd>
                  <Caption selected={selected} caption={element.caption} floatOption={element.floatOption}/>
              </div>
          </div>
      )
  }
