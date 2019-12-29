const Comment = {
    author: (parent, args, { db }, info) => {
        return db.userData.find(user => {
            return user.id === parent.author
        })
    },
    post: (parent, args, { db }, info) => {
        return db.postsData.find(post => {
            return post.id === parent.post
        })
    }
}
export { Comment as default }