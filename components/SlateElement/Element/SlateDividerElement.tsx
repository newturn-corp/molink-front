import React, { useCallback } from 'react'
import {
    useSelected,
    useFocused, ReactEditor, useSlateStatic
} from 'slate-react'
import { DividerElement, DividerType } from '../../../Types/slate/CustomElement'
import { Transforms } from 'slate'
import { MoreHorizRounded, Remove } from '@material-ui/icons'
import { Tooltip } from 'antd'
import LineIcon from 'public/image/icon/line.svg'

const DotDivider = () => {
    return <div className='divider dot-divider'>
        <div className='dot dot-1'></div>
        <div className='dot dot-2'></div>
        <div className='dot dot-3'></div>
    </div>
}

const FaintLongLineDivider = () => {
    return <hr className='divider line-divider faint-long-line-divider'>
    </hr>
}

const LongLineDivider = () => {
    return <hr className='divider line-divider long-line-divider'>
    </hr>
}

const ShortLineDivider = () => {
    return <hr className='divider line-divider short-line-divider'>
    </hr>
}

const FaintShortLineDivider = () => {
    return <hr className='divider line-divider faint-short-line-divider'>
    </hr>
}

const getDividerByType = (type: DividerType) => {
    switch (type) {
    case DividerType.Dot:
        return <DotDivider/>
    case DividerType.FaintLongLine:
        return <FaintLongLineDivider/>
    case DividerType.LongLine:
        return <LongLineDivider/>
    case DividerType.ShortLine:
        return <ShortLineDivider/>
    case DividerType.FaintShortLine:
        return <FaintShortLineDivider/>
    }
}

export const SlateDividerElement: React.FC<{
    attributes,
    children,
    element: DividerElement
  }> = ({ attributes, children, element }) => {
      const selected = useSelected()
      const focused = useFocused()
      const slateEditor = useSlateStatic()
      const currentNodePath = useCallback(() => (
          ReactEditor.findPath(slateEditor, element)
      ), [slateEditor, element])
      const { dividerType } = element
      return (
          <div {...attributes}>
              {children}
              <div
                  contentEditable={false}
                  className={'divider-container'}
                  style={{
                      boxShadow: selected && focused ? '0 0 0 3px #B4D5FF' : undefined
                  }}
              >
                  {getDividerByType(dividerType)}
                  {
                      selected && focused &&
                              <div
                                  className='element-setting-hovering-buttons'
                                  style={{
                                      left: 'calc(50% - 82px)'
                                  }}
                              >
                                  <Tooltip
                                      title={'기본 구분선'}
                                      placement={'top'}
                                  >
                                      <div
                                          className={'button black'}
                                          onClick={event => {
                                              Transforms.setNodes(slateEditor, {
                                                  dividerType: DividerType.LongLine
                                              }, {
                                                  at: currentNodePath()
                                              })
                                          }}
                                      >
                                          <LineIcon />
                                      </div>
                                  </Tooltip>

                                  <Tooltip
                                      title={'흐릿한 구분선'}
                                      placement={'top'}
                                  >
                                      <div
                                          className={'button gray'}
                                          onClick={event => {
                                              Transforms.setNodes(slateEditor, {
                                                  dividerType: DividerType.FaintLongLine
                                              }, {
                                                  at: currentNodePath()
                                              })
                                          }}
                                      >
                                          <LineIcon />
                                      </div>
                                  </Tooltip>

                                  <Tooltip
                                      title={'짦은 구분선'}
                                      placement={'top'}
                                  >
                                      <div
                                          className={'button'}
                                          onClick={event => {
                                              Transforms.setNodes(slateEditor, {
                                                  dividerType: DividerType.ShortLine
                                              }, {
                                                  at: currentNodePath()
                                              })
                                          }}
                                      >
                                          <Remove />
                                      </div>
                                  </Tooltip>
                                  <Tooltip
                                      title={'짦고 흐릿한 구분선'}
                                      placement={'top'}
                                  >
                                      <div
                                          className={'button gray'}
                                          onClick={event => {
                                              Transforms.setNodes(slateEditor, {
                                                  dividerType: DividerType.FaintShortLine
                                              }, {
                                                  at: currentNodePath()
                                              })
                                          }}
                                      >
                                          <Remove />
                                      </div>
                                  </Tooltip>
                                  <Tooltip
                                      title={'점 구분선'}
                                      placement={'top'}
                                  >
                                      <div
                                          className={'button'}
                                          onClick={event => {
                                              Transforms.setNodes(slateEditor, {
                                                  dividerType: DividerType.Dot
                                              }, {
                                                  at: currentNodePath()
                                              })
                                          }}
                                      >
                                          <MoreHorizRounded />
                                      </div>
                                  </Tooltip>
                              </div>
                  }
              </div>
          </div>
      )
  }
