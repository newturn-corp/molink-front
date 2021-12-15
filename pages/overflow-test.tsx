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

const focusLocation = 0
const Test = () => {
    // 한 영어는 대충 10정도
    // 한글은 16정ㄷㅎ
    // space는 5정도
    const [value, setValue] = useState('안녕하세요 제 이름은 후성이요')

    return <div>
        <TextField
            id="standard-textarea"
            multiline
            className={'textline'}
            style={{
                width: '100%',
                border: '0px'
            }}
            value={value}
            spellCheck={false}
            onChange={e => {
                const newValue = e.target.value
                console.log(newValue)
                const lastLine = newValue.split('\n').pop()
                const currentWidth = getTextWidth(lastLine)
                if (currentWidth > 400) {
                    setValue(value + '\n' + newValue[newValue.length - 1])
                } else {
                    setValue(newValue)
                }
            }}
        />
    </div>
}

export default Test
