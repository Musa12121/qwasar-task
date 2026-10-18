export interface User {
  id: number;
  email: string;
  username: string;
  role: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  imageUrl?: string | null;
  published: boolean;
  authorId: number;
  createdAt: string;
  user?: Pick<User, "username">;
  author?: Pick<User, "username">;
}
