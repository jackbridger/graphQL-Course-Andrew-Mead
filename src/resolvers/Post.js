const Post = {
    author: (parent, args, { db }, info) => {
        return db.userData.find((user) => user.id === parent.author)
    },
    comments: (parent, args, { db }, info) => {
        return db.commentsData.filter(comment => {
            return comment.post === parent.id
        })
    }
}
export { Post as default }