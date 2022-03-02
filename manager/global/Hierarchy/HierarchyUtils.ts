import { HierarchyDocumentInfoInterface, PageVisibility } from '@newturn-develop/types-molink'

export const getParents = (
    pageMap: {
        [index: string]: HierarchyDocumentInfoInterface
    },
    pageId: string,
    accumulatedValue = []
) => {
    const page = pageMap[pageId]
    if (!page.parentId) {
        return accumulatedValue
    }
    accumulatedValue.push(page.parentId)
    return getParents(pageMap, page.parentId, accumulatedValue)
}

// 현재 자식이 아닌 최초 요청한 pageID도 들어가는 버그가 있음
export const getChildren = (
    pageMap: {
        [index: string]: any
    },
    pageId: string) => {
    const page = pageMap[pageId]
    if (page.children.length === 0) {
        return [pageId]
    }
    return page.children.reduce((prev: string[], current: string) => {
        prev.push(...getChildren(pageMap, current))
        return prev
    }, [pageId])
}

export const visibilityToText = (visibility: PageVisibility) => {
    switch (visibility) {
    case PageVisibility.Public:
        return '전체 공개'
    case PageVisibility.OnlyFollower:
        return '팔로워만'
    case PageVisibility.Private:
        return '비공개'
    }
}
