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

export interface GiftItemDetail {
  id: string;
  name: string;
  type: string;
  image1: string;
  image2: string;
  historyDate: string | null;
}

export interface GiftItemDetailSpin {
  id: string;
  name: string;
  type: string;
  historyDate: string | null;
}

export interface GiftHistoryItem {
  id: string;
  giftId: string;
  giftName: string;
  giftImage: string;
  giftType: string;
  createdAt?: string | null;
}

interface ApiResponseGifts {
  code: number;
  response: GiftItem[];
  title: string;
}

interface ApiResponseGiftsHistory {
  code: number;
  response: GiftHistoryItem[];
  title: string;
}

interface ApiResponseGiftDetail {
  code: number;
  response: GiftItemDetail;
  title: string;
}
interface ApiResponseGiftDetailSpin {
  code: number;
  response: GiftItemDetailSpin;
  title: string;
}
