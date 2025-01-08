import { BannerDataTypes } from "@/types/global";
import { Dimensions } from "react-native";

export const screenDimensions = Dimensions.get('window');

export const bannerData: BannerDataTypes[] = [
    {
        bannerImageUrl: require("../assets/banners/banner1.jpg"),
    },
    {
        bannerImageUrl: require("../assets/banners/banner2.jpg"),
    },
    {
        bannerImageUrl: require("../assets/banners/banner3.jpg"),
    }
]