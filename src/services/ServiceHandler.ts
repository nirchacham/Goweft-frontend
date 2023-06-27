import axios from 'axios';

const prefix = 'http://localhost:3001'

export async function getUsers() {
    try{
        return await axios.get(`${prefix}/users`)
    } catch(error) { 
        console.error('Error occured while fetching users: ',error);
    }
}

export async function getUserPosts (userId:string, page:number, pageSize:number) {
    try{
        return await axios.get(`${prefix}/posts?userId=${userId}&page=${page}&limit=${pageSize}`)
    } catch(error) {
        console.error('Error occured while fetching user posts: ',error);
    }
}

export async function deleteUserPost(postId:number) {
    try{ 
        return await axios.delete(`${prefix}/posts/delete?postId=${postId}`)
    } catch(error) {
        console.error('Error occured while deleting user post: ',error);
    }
}

