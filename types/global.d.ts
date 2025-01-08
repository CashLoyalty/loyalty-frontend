export interface BannerDataTypes {
  bannerImageUrl: string;  // Adjust the type based on the data structure you have
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
}
  
export interface ApiResponse {
    code: number;
    response: UserResponse;
    title: string;
}
