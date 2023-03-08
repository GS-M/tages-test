
export type PostResponse = {
    userId: number
    id: number
    title: string
    body: string
}

export type UserResponse = {
    id: number
    name: string
    username: string
    email: string
    address: Address
    phone: string
    website: string
    company: Company
}

export type Address = {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
        lat: string
        lng: string
    }
}

export type Company = {
    name: string
    catchPhrase: string
    bs: string
}



export type User = {
    id: number
    name: string
    email: string
    address: string
    website: string
    company: string
    posts: Post[]
}

export type Post = {
    id: number
    title: string
    title_crop: string
    body: string
    comments: Comment[]
}


export type PostWithUserId = {
    userId: number
    id: number
    title: string
    title_crop: string
    body: string
    comments: Comment[]
}


export type Comment = {
    postId: number,
    id: number,
    name: string,
    email: string,
    body: string
}