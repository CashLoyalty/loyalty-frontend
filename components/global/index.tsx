// App.tsx
import React from "react";
import { SafeAreaView } from "react-native";
import InstaStory from "react-native-insta-story";

// Define the Story type
type Story = {
  story_id: number;
  story_image: string;
  swipeText?: string;
  onPress?: () => void;
};

// Define the User type
type User = {
  user_id: number;
  user_image: string;
  user_name: string;
  stories: Story[];
};

// Props for InstaStoryWithDefaults component
type InstaStoryWithDefaultsProps = {
  data: User[];
  duration?: number;
};

// Dummy story data
const storyData: User[] = [
  {
    user_id: 1,
    user_image: "https://www.colchesterzoologicalsociety.com/wp-content/uploads/2024/09/Tiger-600x380.jpg",
    user_name: "Ahmet Çağlar Durmuş",
    stories: [
      {
        story_id: 1,
        story_image: "https://image.freepik.com/free-vector/universe-mobile-wallpaper-with-planets_79603-600.jpg",
        swipeText: "Swipe up for space magic",
      },
      {
        story_id: 2,
        story_image: "https://image.freepik.com/free-vector/mobile-wallpaper-with-fluid-shapes_79603-601.jpg",
        swipeText: "Fluid style",
      },
    ],
  },
  {
    user_id: 2,
    user_image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-1.2.1&w=1000&q=80",
    user_name: "Test User",
    stories: [
      {
        story_id: 1,
        story_image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjORKvjcbMRGYPR3QIs3MofoWkD4wHzRd_eg&usqp=CAU",
        swipeText: "Nature view",
      },
      {
        story_id: 2,
        story_image:
          "https://files.oyebesmartest.com/uploads/preview/vivo-u20-mobile-wallpaper-full-hd-(1)qm6qyz9v60.jpg",
        swipeText: "HD wallpaper",
      },
    ],
  },
];

// InstaStory wrapper with default duration
const InstaStoryWithDefaults: React.FC<InstaStoryWithDefaultsProps> = ({ data = [], duration = 5 }) => {
  return <InstaStory data={data} duration={duration} />;
};

// Root app component
const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <InstaStoryWithDefaults data={storyData} duration={10} />
    </SafeAreaView>
  );
};

export default App;

