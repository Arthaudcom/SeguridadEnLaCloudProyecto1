import api from "./api";
import { Post } from "./types";

// crear un nuevo post
export async function createPost(postData: Post) {
  const response = await api.post("/posts/", postData);
  return response.data;
}

// modificar un post
export async function updatePost(postId: string, postData: Partial<Post>) {
  const response = await api.put(`/posts/${postId}`, postData);
  return response.data;
}

// borra un post
export async function deletePost(postId: string) {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
}

// obtener todos los posts con paginación
export async function getPosts(page: number = 1, limit: number = 10) {
  const response = await api.get(`/posts?page=${page}&limit=${limit}`);
  return response.data;
}

// obtener un post por id
export async function getPost(postId: string) {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
}

// obtener posts por etiqueta
export async function getPostsByTag(tagId: string) {
  const response = await api.get(`/posts/tag/${tagId}`);
  return response.data;
}

export async function togglePostPublish(postId: string, is_published: boolean) {
    const response = await api.put(`/posts/${postId}`, { published: is_published });
    return response.data;
  }
  
