import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../services/postService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Post {
    id: string;
    title: string;
    content: string;
    author: string;
    publishedAt: string;
    created_at: string;
    tags: string[];
    rating?: number;
    isPublished: boolean;
}

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const data = await getPost(id);
        setPost(data);
      } catch (error) {
        console.error("Error al cargar la publicación:", error);
      }
    }
    fetchPost();
  }, [id]);

  if (!post) return <p>Cargando...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{post.content}</p>
        <p className="text-gray-500">Autor: {post.author}</p>
        <p className="text-gray-500">Etiquetas: {post.tags.join(", ")}</p>
      </CardContent>
    </Card>
  );
}
