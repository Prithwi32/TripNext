export type Guide = {
  _id: string;
  guideName: string;
  guideEmail: string;
  profileImage: string;
};

export type Trip = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  tripImages: string[];
  user: string; // Types.ObjectId as string
  guide: string | null; // Types.ObjectId or null
  tripLocation: string;
  tripDescription: string;
  guideDetails?: Guide; // Optional guide details
  hashtags: string[];
  cost: number;
};

export type CreateTripFormData = {
  tripLocation: string;
  tripDescription: string;
  hashtags: string[];
  cost: number;
  guide: string | null;
  tripImage?: FileList;
};

export type UpdateTripFormData = {
  tripLocation: string;
  tripDescription: string;
  hashtags: string[];
  cost: number;
  guide: string | null;
};
