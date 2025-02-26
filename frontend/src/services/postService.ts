import api from "./api";
import { Post } from "./types";

// Créer un post
export async function createPost(postData: Post) {
  const response = await api.post("/posts/", postData);
  return response.data;
}

// Modifier un post existant
export async function updatePost(postId: string, postData: Partial<Post>) {
  const response = await api.put(`/posts/${postId}`, postData);
  return response.data;
}

// Supprimer un post
export async function deletePost(postId: string) {
  const response = await api.delete(`/posts/${postId}`);
  return response.data;
}

// Récupérer tous les posts avec pagination
export async function getPosts(page: number = 1, limit: number = 10) {
  const response = await api.get(`/posts?page=${page}&limit=${limit}`);
  return response.data;
}

// Récupérer un post spécifique
export async function getPost(postId: string) {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
}

// Filtrer les posts par tag
export async function getPostsByTag(tagId: string) {
  const response = await api.get(`/posts/tag/${tagId}`);
  return response.data;
}

export async function togglePostPublish(postId: string, isPublished: boolean) {
    const response = await api.put(`/posts/${postId}`, { published: isPublished });
    return response.data;
  }
  
