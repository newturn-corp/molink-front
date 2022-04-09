import { CustomError } from './Common'

export class InvalidDocumentLocationError extends CustomError {}

export class HierarchyNotExists extends CustomError {}

export class PageNotExists extends CustomError {}

export class ParentVisibilityNarrow extends CustomError {}

export class ChildrenVisibilityWide extends CustomError {}
