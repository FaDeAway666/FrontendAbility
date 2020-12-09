export {}

interface Post {
    readonly id: string,
    title: string
    content: string,
    source?: string // 可选属性
    [propName: string]: string | undefined // 任意属性
}

const post: Post = {
    id: 'id',
    title: 'title',
    content: 'content',
    source: 'source',
    fade: 'fade',
    fale: 'fale',
}
function printPost(post: Post) {
    console.log(post.title)
    console.log(post.content)
    console.log(post.fin)
}