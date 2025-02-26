export interface Post {
    title: string;
    content: string;
    author: string;
    publishedAt: string;
    tags?: string[];
    isPublished: boolean;
  }
  
  export interface Tag {
    name: string;
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
  