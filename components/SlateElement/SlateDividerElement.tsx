import React from 'react'
import {
    useSelected,
    useFocused
} from 'slate-react'
import { DividerElement, DividerType } from '../../utils/slate'

const DotDivider = () => {
    return <div className='divider dot-divider'>
        <div className='dot dot-1'></div>
        <div className='dot dot-2'></div>
        <div className='dot dot-3'></div>
    </div>
}

const FaintLongLineDivider = () => {
    return <div className='divider line-divider faint-long-line-divider'>
    </div>
}

const LongLineDivider = () => {
    return <div className='divider line-divider long-line-divider'>
    </div>
}

const ShortLineDivider = () => {
    return <div className='divider line-divider short-line-divider'>
    </div>
}

const FaintShortLineDivider = () => {
    return <div className='divider line-divider faint-short-line-divider'>
    </div>
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
              </div>
          </div>
      )
  }
