import React from 'react'
import MainStore from '../stores/MainStore'
import { TextLine } from './TextLine'

export const Content: React.FC<{
    fullContent?: boolean
  }> = () => {
      return <div className={'content'}>
          <p className={'title'}>{MainStore.content.title}</p>
          {MainStore.content.texts.map(text => (<TextLine key={Math.random()} text={text}/>))}
      </div>
  }
