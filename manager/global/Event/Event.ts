export enum Event {
    DocumentChildrenOpen,
    UserAuthorization,
    ChangeDocumentTitleInFileSystem,
    DeleteDocument,
    DocumentMapInited,
    InitGlobalVariable,

    NewEditorOpen,
    LoadingContent,
    EditorChange,
    SignOut,
    UpdateHierarchy,
    NewPageLoading,
    // Global Event
    PageBodyClick,

    // Routing Event
    MoveToAnotherPage,

    // Window Event
    UnloadPage,
    WindowResize,

    // Hierarchy Event
    HierarchyOnOffChange,
    HierarchyWidthChange,

    // Toolbar Event
    ToolbarOnOffChange
}

export const eventList = [
    Event.DocumentChildrenOpen,
    Event.UserAuthorization,
    Event.ChangeDocumentTitleInFileSystem,
    Event.DeleteDocument,
    Event.DocumentMapInited,
    Event.InitGlobalVariable,
    Event.MoveToAnotherPage,

    Event.NewEditorOpen,
    Event.LoadingContent,
    Event.EditorChange,
    Event.SignOut,
    Event.UpdateHierarchy,
    Event.NewPageLoading,

    // Global Event
    Event.PageBodyClick,

    // Window Event
    Event.WindowResize,
    Event.UnloadPage,

    // Hierarchy Event
    Event.HierarchyOnOffChange,
    Event.HierarchyWidthChange,

    // Toolbar Event
    Event.ToolbarOnOffChange
]