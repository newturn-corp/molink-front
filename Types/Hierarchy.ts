export interface HierarchyComponentBlockInterface {
    id: string,
    children: HierarchyComponentBlockInterface[]
}

export interface HierarchyDocumentInfoInterface {
    id: string,
    title: string
    icon: string
    userId: number,
    location: string,
    parentId: string,
    order: number
}

export interface HierarchyInfoInterface {
    map: {
        [index: string]: HierarchyDocumentInfoInterface
    },
    list: HierarchyComponentBlockInterface[]
    lastUsedAt: Date
}
