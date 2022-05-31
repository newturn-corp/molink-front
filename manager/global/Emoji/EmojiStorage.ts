import RawEmoji from './RawEmoji.json'
import emojiGroup from './EmojiGroup.json'

const emojiStorage = {
    groups: {},
    emojis: {}
}

for (const group in RawEmoji) {
    RawEmoji[group].reduce((storage, current) => {
        const unified = current.u
        current.g = group
        storage.emojis[unified] = current
        storage.groups[group] = storage.groups[group] || []
        storage.groups[group].push(unified)
        return storage
    }, emojiStorage)
}

export const EmojiStorage = emojiStorage
export const EmojiGroup = emojiGroup
