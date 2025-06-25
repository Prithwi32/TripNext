export interface User {
  _id: string;
  name: string;
  email: string;
  photo?: string;
}

export interface Message {
  _id: string;
  message: string;
  sender: {
    _id: string;
    userName?: string;
    guideName?: string;
    userEmail?: string;
    guideEmail?: string;
    profileImage?: string;
  };
  receiver: {
    _id: string;
    userName?: string;
    guideEmail?: string;
    userEmail?: string;
    guideName?: string;
    profileImage?: string;
  };
  createdAt: string;
  conversationId: string;
}

export interface GuideChatInterfaceProps {
  currentUser?: {
    id: string;
    email: string;
    name: string;
    image?: string;
  };
}
