import { useEffect, useState } from "react";
import { createPost, getPosts, updatePost, deletePost, getPostsByTag, togglePostPublish } from "../services/postService";
import { getTags, assignTagsToPost } from "../services/tagService";
import { ratePost, getAverageRating } from "../services/ratingService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Tag } from "../services/types";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  published_at: string;
  tags: string[];
  rating?: number;
  is_published: boolean;
}

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState("");
  const [postId, setPostId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Cargar las publicaciones y etiquetas al cargar la página
  useEffect(() => {
    loadPosts();
    loadTags();
  }, [currentPage]);

  const loadPosts = async () => {
    const data = await getPosts(currentPage, 10); // 10 posts por página
    const updatedPosts = await Promise.all(
      data.map(async (post: Post) => ({
        ...post,
        rating: await getAverageRating(post.id),
        is_published: post.is_published ?? false,
      }))
    );
    setPosts(updatedPosts);
  };

  const loadTags = async () => {
    const data = await getTags();
    setAllTags(data);
  };


  const handleCreatePost = async () => {
    const newPost = await createPost({
      title,
      content,
      author,
      published_at: new Date().toISOString(),
      tags,
      is_published: true
    });

    if (tags.length > 0) {
      await assignTagsToPost(newPost.id, tags);
    }
    loadPosts();
  };

  const handleUpdatePost = async () => {
    if (!postId) return;
    await updatePost(postId, { title, content, author });
    loadPosts();
    setPostId(null);
  };

  const handleDeletePost = async (id: string) => {
    await deletePost(id);
    loadPosts();
  };

  const handleFilterByTag = async () => {
    if (!selectedTag) return;
    const data = await getPostsByTag(selectedTag);
    setPosts(data);
  };

  const handleRatePost = async (id: string, rating: number) => {
    await ratePost(id, rating);
    loadPosts();
  };

  const handleTogglePublish = async (id: string, is_published: boolean) => {
    await togglePostPublish(id, !is_published);
    loadPosts();
  };

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Gestión de Publicaciones</h1>

      {/* Formulario de creación/modificación */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-semibold mb-4">{postId ? "Editar publicación" : "Crear publicación"}</h2>
        <Input type="text" placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-3" />
        <Textarea placeholder="Contenido" value={content} onChange={(e) => setContent(e.target.value)} className="mb-3" />
        <Input type="text" placeholder="Autor" value={author} onChange={(e) => setAuthor(e.target.value)} className="mb-3" />
        <Input type="text" placeholder="Etiquetas (separadas por comas)" value={tags.join(",")} onChange={(e) => setTags(e.target.value.split(","))} className="mb-3" />

        {postId ? (
          <Button onClick={handleUpdatePost} className="bg-yellow-500 hover:bg-yellow-600">Editar</Button>
        ) : (
          <Button onClick={handleCreatePost} className="bg-green-500 hover:bg-green-600">Crear</Button>
        )}
      </div>

      {/* Filtrar por etiquetas */}
      <div className="flex items-center space-x-3">
        <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="border p-2">
          <option value="">Seleccionar etiqueta</option>
          {allTags.map((tag) => (
            <option key={tag.id} value={tag.id}>{tag.name}</option>
          ))}
        </select>

        <Button onClick={handleFilterByTag} className="bg-blue-500 hover:bg-blue-600">Filtrar</Button>
      </div>

      {/* Lista de las publicaciones */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <p className="text-sm text-gray-500">Autor: {post.author} | {new Date(post.published_at).toLocaleDateString()}</p>
            </CardHeader>
            <CardContent>
              <p>{post.content}</p>
              <p className="text-gray-600 mt-2">Etiquetas: {post.tags.join(", ")}</p>
              <p className="mt-2 font-bold">
                Calificación promedio: {post.rating ?? "Aún no calificado"}
              </p>


              <div className="flex space-x-2 mt-4">
                <Button onClick={() => setPostId(post.id)} className="bg-yellow-500 hover:bg-yellow-600">Editar</Button>
                <Button onClick={() => handleTogglePublish(post.id, post.is_published)}
                  className={post.is_published ? "bg-gray-500 hover:bg-gray-600" : "bg-green-500 hover:bg-green-600"}>
                  {post.is_published ? "Depublicar" : "Publicar"}
                </Button>
                <Button onClick={() => handleDeletePost(post.id)} className="bg-red-500 hover:bg-red-600">Eliminar</Button>
              </div>

              <div className="mt-4">
                <p>Califica esta publicación:</p>
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button key={rating} onClick={() => handleRatePost(post.id, rating)}>{rating} ⭐</Button>
                ))}
              </div>
            </CardContent>
            <Link to={`/posts/${post.id}`} className="text-blue-500">Ver más</Link>
          </Card>
        ))}
      </section>

      {/* Pagination */}
      <div className="flex justify-center space-x-4 mt-6">
        <Button onClick={handlePreviousPage} disabled={currentPage === 1} className="bg-gray-500 hover:bg-gray-600">Anterior</Button>
        <Button onClick={handleNextPage} className="bg-gray-500 hover:bg-gray-600">Siguiente</Button>
      </div>
    </div>
  );
}
