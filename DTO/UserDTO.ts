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
    nickname: string

    constructor (nickname: string) {
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
