import React from 'react'
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
`

export const AuthTitle: React.FC<{
    text: string
}> = ({ text }) => {
    return <Title className={'title'}>{text}</Title>
}
