export class GetUserProfileDTO {
    userId: number
    email: string
    nickname: string
    representativeDocumentId: string | null

    constructor (userId: number, email: string, nickname: string, representativeDocumentId: string | null) {
        this.userId = userId
        this.email = email
        this.nickname = nickname
        this.representativeDocumentId = representativeDocumentId
    }
}

export class SaveSupportDTO {
    content: string

    constructor (content: string) {
        this.content = content
    }
}

export class UserSearchResultDTO {
    id: number
    nickname: string

    constructor (id: number, nickname: string) {
        this.id = id
        this.nickname = nickname
    }
}

export class SearchResponseDTO {
    userSearchResults: UserSearchResultDTO[]

    constructor (userSearchResults: UserSearchResultDTO[]) {
        this.userSearchResults = userSearchResults
    }
}

export class SearchUserDTO {
    searchText: string

    constructor (searchText: string) {
        this.searchText = searchText
    }
}

export class GetUserRepresentativeDocumentURLDTO {
    id: number

    constructor (id: number) {
        this.id = id
    }
}

export class GetUserRepresentativeDocumentResponseDTO {
    url: string

    constructor (url: string) {
        this.url = url
    }
}

export class GetDocumentInitialInfoListDTO {
    userId: number

    constructor (userId: number) {
        this.userId = userId
    }
}
