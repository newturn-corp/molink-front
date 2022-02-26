import TextFormattingPlugin from './TextFormattingPlugin'

const keyDOMBeforeInputHandlers = [
    TextFormattingPlugin
]

export const handleDOMBeforeInput = (event) => {
    keyDOMBeforeInputHandlers.forEach(handler => {
        handler(event)
    })
}
