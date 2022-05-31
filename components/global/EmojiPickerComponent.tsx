import dynamic from 'next/dynamic'
import { IEmojiPickerProps, IEmojiData } from 'emoji-picker-react'
import React, { useEffect, useRef } from 'react'
import { Portal } from '../utils/Portal'
import EmojiPicker from '../../manager/global/EmojiPicker'
import { observer } from 'mobx-react'
const EmojiPickerNoSSRWrapper = dynamic<IEmojiPickerProps>(
    () => import('emoji-picker-react'),
    {
        ssr: false,
        loading: () => <></>
    }
)

export const EmojiPickerComponent: React.FC<{
  }> = observer(() => {
      const pickerRef = useRef<HTMLDivElement>()
      useEffect(() => {
          document.getElementsByTagName('body')[0].addEventListener('click', (event) => {
              EmojiPicker.close()
          })
          EmojiPicker.pickerRef = pickerRef
      }, [])

      return <Portal>
          <div
              ref={pickerRef}
              className={'emoji-picker'}
              style={{
                  userSelect: EmojiPicker.isOpen ? undefined : 'none',
                  opacity: EmojiPicker.isOpen ? '1' : '0'
              }}
          >
              <EmojiPickerNoSSRWrapper
                  groupNames={{
                      smileys_people: '사람들',
                      animals_nature: '자연과 동물',
                      food_drink: '음식',
                      travel_places: '여행과 장소',
                      activities: '활동',
                      objects: '물건',
                      symbols: '심볼',
                      flags: '국기',
                      recently_used: '최근 사용한 이모지'
                  }}
                  disableSearchBar={EmojiPicker.disableSearchbar}
                  onEmojiClick={(event, data) => EmojiPicker.onEmojiClick(event, data)} />
          </div>
      </Portal>
  })
