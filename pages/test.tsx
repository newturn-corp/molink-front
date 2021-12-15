import React, { useRef, useState } from 'react'

import { SidebarLayout } from '../components/SideBarLayout'
import { Contents } from '../components/Contents'
import DirectoryManager from '../manager/DirectoryManager'
import { TextField } from '@material-ui/core'

function getTextWidth (text, font = undefined) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    context.font = font || getComputedStyle(document.body).font

    console.log(context.font)

    return context.measureText(text).width
}

let focusLocation = 0
const Test = () => {
    // 한 영어는 대충 10정도
    // 한글은 16정ㄷㅎ
    // space는 5정도
    setTimeout(() => {
        // console.log(getCursorPosition('안녕하세요 저는 이후성이용', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 6))
        // console.log(getTextWidth('a'))
        // console.log(getTextWidth('aa'))
        // console.log(getTextWidth('aaa'))
        // console.log(getTextWidth('b'))
        // console.log(getTextWidth('bb'))
        // console.log(getTextWidth('bbb'))
        // console.log(getTextWidth('가'))
        // console.log(getTextWidth('가가'))
        // console.log(getTextWidth('가가가'))
        // console.log(getTextWidth(' '))
    }, 500)

    const getCursorPosition = (before: string, current: string, beforePosition: number) => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')

        context.font = getComputedStyle(document.body).font

        const beforeText = before.slice(0, beforePosition)
        const beforeTextWidth = context.measureText(beforeText).width
        const currentWidth = context.measureText(current).width
        if (beforeTextWidth > currentWidth) {
            return current.length - 1
        }
        let index = Math.min(current.length, beforeText.length)
        let count = 0
        while (true) {
            const width = context.measureText(current.slice(0, index)).width
            const diff = beforeTextWidth - width
            console.log(diff)
            if (Math.abs(diff) < 20) {
                return index
            }
            if (count++ > 5) {
                return index
            }
            index += Math.sign(diff)
        }
    }

    function setCaretPosition (ctrl, pos) {
        // Modern browsers
        if (ctrl.setSelectionRange) {
            ctrl.focus()
            ctrl.setSelectionRange(pos, pos)

            // IE8 and below
        } else if (ctrl.createTextRange) {
            const range = ctrl.createTextRange()
            range.collapse(true)
            range.moveEnd('character', pos)
            range.moveStart('character', pos)
            range.select()
        }
    }

    const inputRef1 = useRef<HTMLInputElement>(null)
    const inputRef2 = useRef<HTMLInputElement>(null)

    const [focus1, setFocus1] = useState(false)
    const [focus2, setFocus2] = useState(false)
    if (focus1) {
        new Promise(resolve => setTimeout(resolve, 100)).then(() => {
            setFocus2(false)
            setCaretPosition(inputRef1.current, focusLocation)
        })
    }
    if (focus2) {
        new Promise(resolve => setTimeout(resolve, 100)).then(() => {
            setFocus1(false)
            setCaretPosition(inputRef2.current, focusLocation)
        })
    }

    return <div>
        <TextField
            inputRef={inputRef1}
            id="standard-textarea"
            multiline
            className={'textline'}
            style={{
                width: '100%',
                border: '0px'
            }}
            value={'안녕하세요 제 이름은 후성이요'}
            spellCheck={false}
            onKeyDown={event => {
                console.log(event.key)
                if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    focusLocation = getCursorPosition('안녕하세요 제 이름은 후성이요', 'aaaa', inputRef1.current.selectionStart)
                    setFocus2(true)
                }
            }}
        /><TextField
            inputRef={inputRef2}
            id="standard-textarea"
            multiline
            className={'textline'}
            style={{
                width: '100%',
                border: '0px'
            }}
            value={'aaaa'}
            spellCheck={false}
            onKeyDown={event => {
                console.log(event.key)
                if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    focusLocation = getCursorPosition('aaaa', '안녕하세요 제 이름은 후성이요', inputRef2.current.selectionStart)
                    setFocus1(true)
                    console.log(focus1)
                }
            }}
        />
    </div>
}

export default Test
