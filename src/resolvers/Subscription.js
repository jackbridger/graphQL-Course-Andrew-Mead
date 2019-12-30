const Subscription = {
    newComment: {
        subscribe: (parent, { postID }, { pubsub }, info) => {
            return pubsub.asyncIterator(`newComment ${postID}`)
        }
    },
    newPost: {
        subscribe: (parent, args, { pubsub }, info) => {
            return pubsub.asyncIterator('newPost')
        }
    }

}
export { Subscription as default }