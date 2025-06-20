export type BlogUser = {
  _id: string;
  userName: string;
  userEmail: string;
  profileImage?: string;
};

export type Blog = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  blogImages: string[];
  user: BlogUser;
  blogTitle: string;
  blogDescription: string;
  blogComments: string[];
  hashtags: string[];
};
