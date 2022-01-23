import Automerge from 'automerge'

export function getAutomergeDocumentThroughRestAPI<T> (raw: number[]) {
    const arr = Uint8Array.from(raw) as any
    arr.__binaryDocument = true
    return Automerge.load<T>(arr)
}
