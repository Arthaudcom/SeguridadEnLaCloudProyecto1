export interface Post {
    title: string;
    content: string;
    author: string;
    published_at: string;
    tags?: string[];
    is_published: boolean;
  }

export interface PostCreate {
  title: string;
  content: string;
  author: string;
  tag_ids: number[];
  is_published: boolean;
}

  
  export interface Tag {
    name: string;
    id: number;
  }
  
  export interface User {
    username: string;
    email: string;
    password: string;
  }
  
  export interface Rating {
    postId: string;
    rating: number;
  }
  
  export interface ResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
  }
  