import React from 'react'
import {
    useSlateStatic,
    useSelected,
    useFocused
} from 'slate-react'
import { css } from '@emotion/css'
import { Rnd } from 'react-rnd'
import ContentManager from '../../manager/ContentManager'
import { Node, Transforms } from 'slate'
import { FormatAlignCenter, FormatAlignLeft, FormatAlignRight, Height } from '@material-ui/icons'
import { red } from '@material-ui/core/colors'
import { ImageElement, ImageFloatOption } from '../../utils/slate'

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
          <div {...attributes}>
              {children}
              <div
                  contentEditable={false}
                  className={css`
                    position: relative;
                    margin: 10px;
                    width: ${800}px;
                    height: ${element.height}px;
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
                      enableResizing={selected && focused}
                      lockAspectRatio
                      style={{
                          position: 'relative',
                          float: element.floatOption === ImageFloatOption.Right ? 'right' : undefined,
                          marginLeft: element.floatOption === ImageFloatOption.Center ? (800 - element.width) / 2 : undefined,
                          transform: 'none !important'
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
              </div>
          </div>
      )
  }
