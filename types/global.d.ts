import { ImageSourcePropType } from "react-native";
export interface BannerDataTypes {
  bannerImageUrl: ImageSourcePropType;
}

export interface UserResponse {
  id: string;
  phoneNumber: string;
  passCode: string;
  firstName: string;
  lastName: string;
  email: string;
  birthOfDate: string;
  sex: string;
  kyc: number;
  point: number;
  lottoCount: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  level: {
    name: string;
    levelPoint: number;
    collectPoint: number;
  };
  surveyCount: number;
  taskCount: number;
}

export interface ApiResponse {
  code: number;
  response: UserResponse;
  title: string;
}

export interface GiftItem {
  id: string;
  name: string;
  probability: number;
  limit: number;
  text: string;
  type: string;
  expiresAt?: string | null;
  image1?: string;
  image2?: string;
  point?: number;
  isCoupon?: boolean;
}

interface ApiResponseGifts {
  code: number;
  response: GiftItem[];
  title: string;
}
