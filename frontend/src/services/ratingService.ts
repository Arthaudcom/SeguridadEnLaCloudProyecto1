import api from "./api";

// Noter un post
export async function ratePost(postId: string, rating: number) {
  const response = await api.post("/ratings/", { postId, rating });
  return response.data;
}

// Obtenir la note moyenne d'un post
export async function getAverageRating(postId: string) {
  const response = await api.get(`/ratings/${postId}/average-rating`);
  return response.data;
}
