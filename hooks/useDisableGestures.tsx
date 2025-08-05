import { useEffect } from "react";
import { useNavigation } from "expo-router";

export function useDisableGestures() {
  const navigation = useNavigation();

  useEffect(() => {
    let parent = navigation.getParent();
    while (parent) {
      parent.setOptions({ gestureEnabled: false });
      parent = parent.getParent();
    }
    navigation.setOptions({ gestureEnabled: false });
    return () => {
      let p = navigation.getParent();
      while (p) {
        p.setOptions({ gestureEnabled: true });
        p = p.getParent();
      }
      navigation.setOptions({ gestureEnabled: true });
    };
  }, [navigation]);
}
