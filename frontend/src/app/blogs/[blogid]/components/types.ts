export interface CommentUser {
  _id: string;
  userName: string;
  profileImage?: string;
  profilePicture?: string;
}

export interface Comment {
  _id: string;
  userId: CommentUser | string;
  toUserId?: CommentUser | string;
  blogId: string;
  commentId: string | null;
  message: string;
  createdAt: string;
  updatedAt: string;
  replies?: Comment[];
}

export interface ReplyMap {
  [commentId: string]: boolean;
}

export interface VisibleRepliesMap {
  [commentId: string]: number;
}
