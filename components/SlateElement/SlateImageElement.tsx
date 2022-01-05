import React, { useRef, useState } from 'react'
import {
    useSelected,
    useFocused,
    useSlateStatic,
    ReactEditor
} from 'slate-react'
import { css } from '@emotion/css'
import { Rnd } from 'react-rnd'
import ContentManager from '../../manager/ContentManager'
import { Editor, Transforms } from 'slate'
import { FormatAlignCenter, FormatAlignLeft, FormatAlignRight } from '@material-ui/icons'
import { ImageElement, ImageFloatOption, TextCategory } from '../../utils/slate'
import StyleManager from '../../manager/StyleManager'
import { Input } from 'antd'
import TextArea, { TextAreaRef } from 'antd/lib/input/TextArea'

// const Caption: React.FC<{
//     selected: boolean,
//     caption: string
//   }> = ({ selected, caption }) => {
//       const inputRef = useRef<TextAreaRef>(null)
//       const [captionFocused, setCaptionFocused] = useState(false)
//       if (!selected) {
//           if (captionFocused) {
//               setCaptionFocused(false)
//           }
//           if (caption === '') {
//               return <></>
//           }
//       }
//       if (caption === '' && !selected) {
//           return <></>
//       }
//       if (captionFocused) {
//           setTimeout(() => {
//               console.log('나 호출')
//               console.log(inputRef.current)
//               inputRef.current.focus()
//           }, 500)
//       }
//       return <div onClick={() => {
//           console.log('눌림')
//           setCaptionFocused(true)
//       }}>
//           <TextArea
//               ref={inputRef}
//               className={'caption'}
//               style={{
//                   userSelect: captionFocused ? undefined : 'none'
//               }}
//               autoFocus={captionFocused}
//               tabIndex={-1}
//               //   onClick={() => {
//               //       console.log('눌림')
//               //       setCaptionFocused(true)
//               //   }}
//               autoSize={true}
//               placeholder='이미지 설명'
//               bordered={false}
//               defaultValue={caption}
//               readOnly={!captionFocused}
//               rows={1}
//               onChange={(e) => {
//                   const inputText = inputRef.current.resizableTextArea.props.value as string
//                   //   console.log(inputText)
//                   //   console.log(inputRef.current.resizableTextArea.textArea.style.height)
//                   const height = Number(inputRef.current.resizableTextArea.textArea.style.height.replace('px', ''))
//                   //   setCaptionFocused(false)
//                   Transforms.setNodes(ContentManager.editor, {
//                       caption: inputText,
//                       captionHeight: height
//                   }, {
//                       at: ContentManager.editor.selection
//                   })
//               }}
//               onBlur={(e) => {
//                   //   const inputText = inputRef.current.resizableTextArea.props.value as string
//                   //   Transforms.setNodes(ContentManager.editor, {
//                   //       caption: inputText
//                   //   }, {
//                   //       at: ContentManager.editor.selection
//                   //   })
//                   console.log(inputRef.current.resizableTextArea.textArea.style.height)
//                   setCaptionFocused(false)
//               }}
//               onKeyDown={(e) => console.log(e.key)}
//           />
//       </div>
//       //   return <figcaption
//       //       //   style={{ width }}
//       //       //   css={styles.figcaption?.css}
//       //       //   className={styles.figcaption?.className}
//       //   >
//       //       {
//       //           captionFocused
//       //               ? <TextArea
//       //                   ref={inputRef}
//       //                   className={'caption'}
//       //                   autoFocus={selected}
//       //                   tabIndex={-1}
//       //                   onClick={() => { setCaptionFocused(true) }}
//       //                   onFocus={() => { console.log('나 포커스') }}
//       //                   autoSize={true}
//       //                   placeholder='이미지 설명'
//       //                   bordered={false}
//       //                   defaultValue={caption}
//       //                   disabled={!captionFocused}
//       //                   readOnly={!captionFocused}
//       //                   onBlur={(e) => {
//       //                       const inputText = inputRef.current.resizableTextArea.props.value as string
//       //                       Transforms.setNodes(ContentManager.editor, {
//       //                           caption: inputText
//       //                       }, {
//       //                           at: ContentManager.editor.selection
//       //                       })
//       //                       setCaptionFocused(false)
//       //                   }}
//       //               />
//       //               : <p className='caption' onClick={() => setCaptionFocused(true)}>
//       //                   {caption === '' ? '이미지 설명' : caption}
//       //               </p>
//       //       }

//       //   </figcaption>
//   }

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
                  //   console.log()
                  //   const inputText = inputRef.current.resizableTextArea.props.value as string
                  //   console.log(inputText)
                  Transforms.setNodes(ContentManager.editor, {
                      caption: e.target.value
                  }, {
                      at: ContentManager.editor.selection
                  })
              }}
              onBlur={(e) => {
                  setCaptionFocused(false)
              }}
              onKeyDown={(e) => {
                  if (e.ctrlKey || e.shiftKey) {
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
    element: ImageElement
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
                    width: ${StyleManager.contentStyle.content.width}px;
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
                          marginLeft: element.floatOption === ImageFloatOption.Center ? (StyleManager.contentStyle.content.width - element.width) / 2 : undefined,
                          transform: 'none !important',
                          display: 'block'
                      }}
                      onResizeStop={(e, direction, ref, delta, position) => {
                          const widthStr = ref.style.width
                          const heightStr = ref.style.height
                          const width = Number(widthStr.slice(0, widthStr.length - 2))
                          const height = Number(heightStr.slice(0, heightStr.length - 2))
                          Transforms.setNodes(ContentManager.editor, {
                              width,
                              height
                          }, {
                              at: ContentManager.editor.selection
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
                                              Transforms.setNodes(ContentManager.editor, {
                                                  floatOption: ImageFloatOption.Left
                                              }, {
                                                  at: ContentManager.editor.selection
                                              })
                                          }}
                                      >
                                          <FormatAlignLeft />
                                      </div>
                                      <div
                                          className={'button'}
                                          onClick={event => {
                                              Transforms.setNodes(ContentManager.editor, {
                                                  floatOption: ImageFloatOption.Center
                                              }, {
                                                  at: ContentManager.editor.selection
                                              })
                                          }}
                                      >
                                          <FormatAlignCenter />
                                      </div>
                                      <div
                                          className={'button'}
                                          onClick={event => {
                                              Transforms.setNodes(ContentManager.editor, {
                                                  floatOption: ImageFloatOption.Right
                                              }, {
                                                  at: ContentManager.editor.selection
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
