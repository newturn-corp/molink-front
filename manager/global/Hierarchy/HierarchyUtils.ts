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

const _getChildren = (
    pageMap: {
        [index: string]: any
    },
    pageId: string) => {
    const page = pageMap[pageId]
    if (page.children.length === 0) {
        return [pageId]
    }
    return page.children.reduce((prev: string[], current: string) => {
        prev.push(..._getChildren(pageMap, current))
        return prev
    }, [pageId]).filter(id => id !== pageId)
}

export const getChildren = (
    pageMap: {
        [index: string]: any
    },
    pageId: string) => {
    return _getChildren(pageMap, pageId).filter(id => id !== pageId)
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
