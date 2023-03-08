import axios from 'axios';
import { inspect } from 'util';
import { Comment, PostWithUserId, User, Post, PostResponse, UserResponse } from './types';

const instance = axios.create({
    baseURL: 'http://jsonplaceholder.typicode.com/',
})

const usersAPI = {
    async getPosts(): Promise<PostWithUserId[]> {
        return (await instance.get<PostResponse[]>(`posts`)).data.map(p => convertPost(p))

    },
    async getUsers(): Promise<User[]> {
        return (await instance.get<UserResponse[]>(`users`)).data.map(u => convertUser(u))
    },
    async getComments(postId: number): Promise<Comment[]> {
        return (await instance.get<Comment[]>(`posts/${postId}/comments`)).data
    },
}


function convertUser(user: UserResponse): User {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        address: `${user.address.city}, ${user.address.street}, ${user.address.suite}`,
        website: `https://${user.website}`,
        company: user.company.name,
        posts: []
    }
}

function convertPost(post: PostResponse): PostWithUserId {
    let title_crop = post.title.substring(0, 20) + '...'
    return {
        userId: post.userId,
        id: post.id,
        title: post.title,
        title_crop: title_crop,
        body: post.body,
        comments: []
    }
}

async function injectCommentsToPost(post: Post): Promise<Post> {
    post.comments = await usersAPI.getComments(post.id)
    return post
}

function addPostsToUsers(users: User[], posts: PostWithUserId[]): User[] {
    let grouppedPosts: Post[][] = posts.reduce((groups, post) => {
        let userId = post.userId
        if (!groups[userId]) {
            groups[userId] = []
        }
        delete post.userId
        groups[userId].push(post)
        return groups
    }, [])
    return users.map(user => {
        return { ...user, posts: grouppedPosts[user.id] ?? [] }
    })
}

async function showNewUsersWithPosts() {
    let users = await usersAPI.getUsers()
    let posts = await usersAPI.getPosts()

    let usersWithPosts = addPostsToUsers(users, posts)

    let ervinHowell = usersWithPosts.find(user => user.name === "Ervin Howell")

    ervinHowell.posts = await Promise.all(ervinHowell.posts.map(post => injectCommentsToPost(post)))
    console.log(inspect(usersWithPosts, { showHidden: false, depth: null, colors: true }))
}

showNewUsersWithPosts()
