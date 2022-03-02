export class GetUserProfileDTO {
    userId: number
    email: string
    nickname: string
    representativeDocumentId: string | null
    profileImageUrl: string | null
    biography: string

    constructor (userId: number, email: string, nickname: string, representativeDocumentId: string | null, profileImageUrl: string | null, biography: string) {
        this.userId = userId
        this.email = email
        this.nickname = nickname
        this.representativeDocumentId = representativeDocumentId
        this.profileImageUrl = profileImageUrl
        this.biography = biography
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
    profileImageUrl: string | null
    biography: string
    isFollowing: boolean
    isFollowRequested: boolean

    constructor (id: number, nickname: string, profileImageUrl: string | null, biography: string, isFollowing: boolean, isFollowRequested: boolean) {
        this.id = id
        this.nickname = nickname
        this.profileImageUrl = profileImageUrl
        this.biography = biography
        this.isFollowing = isFollowing
        this.isFollowRequested = isFollowRequested
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

export class UpdateUserProfileImageDto {
    image: File

    constructor (image: File) {
        this.image = image
    }
}

export class UpdateUserBiographyDTO {
    biography: string

    constructor (biography: string) {
        this.biography = biography
    }
}

export class FollowRequestDTO {
    targetId: number

    constructor (targetId: number) {
        this.targetId = targetId
    }
}

export enum FollowResult {
    Succeeded = 'succeeded',
    Requested = 'requested'
}

export class FollowResponseDTO {
    followResult: FollowResult

    constructor (followResult: FollowResult) {
        this.followResult = followResult
    }
}
