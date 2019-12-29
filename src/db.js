let userData = [{
    id: '1',
    name: 'jack bridger',
    email: "jack@g.com"
},
{
    id: '2',
    name: 'mark bridger',
    email: "mark@g.com",
    age: 58
}]

let postsData = [{
    id: "hsd",
    title: "smashed",
    body: "String!",
    published: true,
    author: '2',
},
{
    id: "hsdsdsd",
    title: "jacky",
    body: "String!",
    published: true,
    author: '2'
}]

let commentsData = [{
    id: 'c1',
    text: 'haha',
    author: '2',
    post: 'hsd'
},
{
    id: 'c2',
    text: 'lol',
    author: '1',
    post: 'hsd'
}
]

const db = {
    userData,
    commentsData,
    postsData
}
export { db as default }