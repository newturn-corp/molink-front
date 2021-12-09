import { Book, Folder, InsertDriveFile } from '@material-ui/icons'

export const getIconByName = (iconName: string) => {
    switch (iconName) {
    case 'book':
        return Book
    case 'folder':
        return Folder
    case 'file':
        return InsertDriveFile
    default:
        throw new Error('Unhandled Icon')
    }
}
