import { GraphQLServer } from 'graphql-yoga'
import uuid from 'uuid/v4'
import db from './db';

// typedefs schema 


// resolvers



const resolvers = {
    Query: {
        me: () => ({
            name: 'jack bridger',
            id: 'abc2',
            email: "jack@g.com"
        }),
        users: (parent, args, { db }, info) => {
            if (args.query) {
                return db.userData.filter(x => x.name.includes(args.query))
            }
            else return db.userData
        },
        post: () => ({
            id: "abc3",
            title: "hello world",
            body: "my body",
            published: true
        }),
        posts: (parent, args, { db }, info) => {
            if (args.query) {
                return db.postsData.filter(post => post.title.includes(args.query))
            }
            else return db.postsData
        },
        comments: () => {
            return db.commentsData
        }
    },
    Post: {
        author: (parent, args, { db }, info) => {
            return db.userData.find((user) => user.id === parent.author)
        },
        comments: (parent, args, { db }, info) => {
            return db.commentsData.filter(comment => {
                return comment.post === parent.id
            })
        }
    },

    Mutation: {
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
    },
    User: {
        posts: (parent, args, { db }, info) => {

            return db.postsData.filter(post => {
                console.log('post.author', post.author)
                console.log('parent.id', parent.id)
                return post.author === parent.id
            })
        },
        comments: (parent, args, { db }, info) => {
            return db.commentsData.filter(comment => {
                return comment.author === parent.id
            })
        }
    },
    Comment: {
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
}

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    context: {
        db
    }
})
server.start(() => {
    console.log('server is up')
})