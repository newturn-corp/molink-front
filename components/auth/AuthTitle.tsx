import React, { CSSProperties } from 'react'
import styled from 'styled-components'

const Title = styled.div`
  font-family: Pretendard;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  text-align: center;
  color: #131415;
  margin-bottom: 40px;
  user-select: none;
  word-break: keep-all;
`

export const AuthTitle: React.FC<{
    text: string
    style?: CSSProperties
}> = (props) => {
    return <Title
        className={'title'}
        dangerouslySetInnerHTML={{
            __html: props.text
        }}
        {...props}
    />
}
