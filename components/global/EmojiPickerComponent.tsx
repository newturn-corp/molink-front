import dynamic from 'next/dynamic'
import React, { useEffect, useRef } from 'react'
import { Portal } from '../utils/Portal'
import EmojiPicker from '../../manager/global/EmojiPicker'
import { observer } from 'mobx-react'
import { Categories, EmojiStyle } from 'emoji-picker-react'

const EmojiPickerNoSSRWrapper = dynamic(
    () => {
        return import('emoji-picker-react')
    },
    { ssr: false }
)

export const EmojiPickerComponent: React.FC<{
  }> = observer(() => {
      const pickerRef = useRef<HTMLDivElement>()
      useEffect(() => {
          EmojiPicker.pickerRef = pickerRef
      }, [])

      return <Portal>
          <div
              ref={pickerRef}
              className={'emoji-picker'}
              style={{
                  userSelect: EmojiPicker.isOpen ? undefined : 'none'
              }}
              onClick={(event) => {
                  event.stopPropagation()
                  event.preventDefault()
              }}
          >
              {
                  EmojiPicker.isOpen && <EmojiPickerNoSSRWrapper
                      categories={[
                          {
                              category: Categories.SUGGESTED,
                              name: '추천'
                          },
                          {
                              category: Categories.SMILEYS_PEOPLE,
                              name: '사람들'
                          },
                          {
                              category: Categories.ANIMALS_NATURE,
                              name: '자연과 동물'
                          },
                          {
                              category: Categories.FOOD_DRINK,
                              name: '음식'
                          },
                          {
                              category: Categories.TRAVEL_PLACES,
                              name: '여행과 장소'
                          },
                          {
                              category: Categories.ACTIVITIES,
                              name: '활동'
                          },
                          {
                              category: Categories.OBJECTS,
                              name: '물건'
                          },
                          {
                              category: Categories.SYMBOLS,
                              name: '심볼'
                          },
                          {
                              category: Categories.FLAGS,
                              name: '국기'
                          }
                      ]}
                      emojiStyle={EmojiStyle.GOOGLE}
                      lazyLoadEmojis={true}
                      searchDisabled={EmojiPicker.disableSearchbar}
                      onEmojiClick={(data, event) => EmojiPicker.onEmojiClick(data)}
                  />
              }
          </div>
      </Portal>
  })
