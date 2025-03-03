import api from "./api";

export async function ratePost(post_id: string, score: number) {
  const token = localStorage.getItem("token") ?? "";

  const response = await api.post(
    `/ratings/?token=${token}`,
    { post_id, score }
  );

  return response.data;
}



// Obtenir la note moyenne d'un post
export async function getAverageRating(post_id: string) {
  const response = await api.get(`/ratings/${post_id}/average-rating`);
  return response.data.average_rating;
}
