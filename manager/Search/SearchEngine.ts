export interface SearchEngine {
    searchResultCountPerPage: number
    searchResults: any[]
    searchText: string
    total: number
    page: number

    search (text: string, page: number)

    clear ()
}
