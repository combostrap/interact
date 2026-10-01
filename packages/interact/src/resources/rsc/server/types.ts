
export type PageNode = {
    name: string
    path: string
    type: "file" | "folder"
    children?: PageNode[]
}