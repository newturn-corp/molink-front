import dynamic from 'next/dynamic'
import { IEmojiPickerProps, IEmojiData } from 'emoji-picker-react'
import React from 'react'
const EmojiPickerNoSSRWrapper = dynamic<IEmojiPickerProps>(
    () => import('emoji-picker-react'),
    {
        ssr: false,
        loading: () => <></>
    }
)

export const Category: React.FC<{
    showEmojiPicker: boolean,
    onEmojiPick: (event: React.MouseEvent<Element, MouseEvent>, data: IEmojiData) => void
}> = ({ showEmojiPicker, onEmojiPick }) => {
    if (!showEmojiPicker) {
        return <></>
    }

    return <EmojiPickerNoSSRWrapper
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
        onEmojiClick={onEmojiPick} />
}
