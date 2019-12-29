import uuid from 'uuid/v4'

const Mutation = {
    createUser: (parent, args, { db }, info) => {
        const emailInUse = db.userData.some(user => user.email === args.data.email)
        if (emailInUse) throw new Error('email in use')
        const newUser = {
            id: uuid(),
            ...args.data
        }
        db.userData.push(newUser);
        return newUser;

    },
    deleteUser: (parent, args, { db }, info) => {
        // Check user exists 
        const userIndex = db.userData.findIndex(user => user.id === args.id)
        if (userIndex === -1) throw new Error("no such user");
        const userToDelete = db.userData[userIndex];

        // Delete the user
        db.userData = db.userData.filter(user => user.id !== args.id)
        // Delete posts made by users, and comments on that post

        db.postsData = db.postsData.filter(post => {
            console.log('post.id ', post.id)
            if (post.author === args.id) {
                db.commentsData = db.commentsData.filter(comment => comment.post !== post.id)
            }
            return post.author !== args.id
        })


        db.commentsData = db.commentsData.filter(comment => comment.author !== args.id)

        return userToDelete


    },
    updateUser: (parent, { data, id }, { db }, info) => {
        const user = db.userData.find(user => user.id === id)

        if (!user) throw new Error('user not found');
        if (typeof data.email === 'string') {
            const emailTaken = db.userData.some(user => user.email === data.email)
            if (emailTaken) throw new Error('email taken')
            user.email = data.email
        }
        if (typeof data.name === 'string') {
            user.name = data.name
        }
        if (typeof data.age !== 'undefined') {
            user.age = data.age
        }
        return user;
    }
    ,
    createPost: (parent, args, { db }, info) => {
        const userExists = db.userData.some(user => user.id === args.data.author)
        if (!userExists) throw new Error('user not found')

        const newPost = {
            id: uuid(),
            ...args.data,
            comments: []
        }
        db.postsData.push(newPost);
        return newPost
    },
    deletePost: (parent, args, { db }, info) => {
        const postIndex = db.postsData.findIndex(post => post.id === args.id)
        if (postIndex === -1) throw new Error("no such post");
        const postToDelete = db.postsData[postIndex]

        db.postsData = db.postsData.filter(post => post.id !== args.id);
        db.commentsData = db.commentsData.filter(comment => comment.post !== args.id)

        // delete the post
        // delete the comments

        return postToDelete
    }
    ,
    createComment: (parent, args, { db }, info) => {
        const userExists = db.userData.some(user => user.id === args.data.author)
        const postExists = db.postsData.some(post => post.id === args.data.post)
        if (!userExists) throw new Error('user doesnt exist')
        if (!postExists) throw new Error('post doesnt exist')
        const newComment = {
            id: uuid(),
            ...args.data
        }
        db.commentsData.push(newComment);
        return newComment

    },
    deleteComment: (parent, args, { db }, info) => {
        const commentIndex = db.commentsData.findIndex(comment => comment.id === args.id)
        if (commentIndex === -1) throw new Error("no such comment");
        const commentToDelete = db.commentsData[commentIndex];

        db.commentsData = db.commentsData.filter(comment => comment.id !== args.id)

        return commentToDelete
    }
}
export { Mutation as default }