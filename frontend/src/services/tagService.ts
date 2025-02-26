import api from "./api";
import { Tag } from "./types";

export async function createTag(tagData: Tag) {
  const response = await api.post("/tags/", tagData);
  return response.data;
}

export async function getTags() {
  const response = await api.get("/tags/");
  return response.data;
}

export async function assignTagsToPost(postId: string, tagIds: string[]) {
  const response = await api.post(`/tags/${postId}/assign-tags`, { tagIds });
  return response.data;
}
