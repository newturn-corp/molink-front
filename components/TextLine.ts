// import React, { useRef, useState } from 'react'
// import { observer } from 'mobx-react'

// import Text from '../domain/Text'
// import ContentsManager from '../manager/ContentManager'
// import { TextField } from '@material-ui/core'
// import { getCursorPosition } from '../utils/utils'

// function getTextWidth (text, font = undefined) {
//     const canvas = document.createElement('canvas')
//     const context = canvas.getContext('2d')

//     context.font = font || getComputedStyle(document.body).font

//     console.log(context.font)

//     return context.measureText(text).width
// }

// export const TextLineComponent: React.FC<{
//     text: Text
//   }> = observer(({ text }) => {
//       const inputRef = useRef<HTMLInputElement>(null)

//       function setCaretPosition (ctrl, pos) {
//           // Modern browsers
//           if (ctrl.setSelectionRange) {
//               ctrl.focus()
//               ctrl.setSelectionRange(pos, pos)

//               // IE8 and below
//           } else if (ctrl.createTextRange) {
//               const range = ctrl.createTextRange()
//               range.collapse(true)
//               range.moveEnd('character', pos)
//               range.moveStart('character', pos)
//               range.select()
//           }
//       }

//       //   const getCursorPosition = (before: string, current: string, beforePosition: number) => {
//       //       const canvas = document.createElement('canvas')
//       //       const context = canvas.getContext('2d')

//       //       context.font = getComputedStyle(inputRef.current).font
//       //       const beforeText = before.slice(0, beforePosition)
//       //       const beforeTextWidth = context.measureText(beforeText).width % Number(inputRef.current.clientWidth)
//       //       const currentWidth = context.measureText(current).width
//       //       if (beforeTextWidth > currentWidth) {
//       //           return current.length
//       //       }
//       //       let index = Math.min(current.length, beforeText.length)
//       //       let minIndex = index
//       //       let minDiff = 10000
//       //       let count = 0
//       //       while (true) {
//       //           const width = context.measureText(current.slice(0, index)).width
//       //           const diff = beforeTextWidth - width
//       //           console.log(diff)
//       //           if (Math.abs(diff) < 3) {
//       //               return index
//       //           }
//       //           if (count++ > 5) {
//       //               break
//       //           }
//       //           if (minDiff > Math.abs(diff)) {
//       //               minIndex = index
//       //               minDiff = Math.abs(diff)
//       //           }
//       //           index += Math.sign(diff)
//       //       }
//       //       return minIndex
//       //   }

//       if (text.shouldFocus) {
//           new Promise(resolve => setTimeout(resolve, 100)).then(() => {
//               const canvas = document.createElement('canvas')
//               const context = canvas.getContext('2d')
//               context.font = getComputedStyle(document.body).font
//               setCaretPosition(inputRef.current, getCursorPosition(context, ContentsManager.selectedTextBefore.value, ContentsManager.selectionPositionBefore, text.value, inputRef.current.clientWidth))
//               text.shouldFocus = false
//           })
//       }

//       return (
//           <TextField
//               inputRef={inputRef}
//               id="standard-textarea"
//               multiline
//               className={'textline'}
//               style={{
//                   width: '100%',
//                   border: '0px',
//                   wordBreak: 'break-all'
//               }}
//               value={text.value}
//               onChange={event => {
//                   text.value = event.target.value
//               }}
//               spellCheck={false}
//               onKeyDown={event => ContentsManager.handleKeyDown(text, event, inputRef.current)}
//           />
//       )
//   })
