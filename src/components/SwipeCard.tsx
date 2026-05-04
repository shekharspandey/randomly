import { Image } from "expo-image";
import { useEffect } from "react";
import { Dimensions, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const SWIPE_THRESHOLD = width * 0.25;

export function SwipeCard({
  profile,
  isTop,
  onSwiped,
}: {
  profile: any;
  isTop: boolean;
  onSwiped: () => void;
}) {
  const translateX = useSharedValue(0);
  const scale = useSharedValue(isTop ? 1 : 0.95);

  useEffect(() => {
    scale.value = withTiming(isTop ? 1 : 0.95, { duration: 180 });
  }, [isTop]);

  const pan = Gesture.Pan()
    .enabled(isTop)
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        const direction = translateX.value > 0 ? width * 1.2 : -width * 1.2;

        translateX.value = withTiming(direction, { duration: 220 }, () => {
          runOnJS(onSwiped)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-width, 0, width],
      [-12, 0, 12]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { rotate: `${rotate}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        style={animatedStyle}
        className="absolute w-full h-[75%] rounded-3xl overflow-hidden bg-black"
      >
        <Image
          source={{ uri: profile.image }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
          transition={0}                 // 🔥 no fade → no flash
          cachePolicy="memory-disk"
        />

        <View className="absolute bottom-0 w-full p-4 bg-black/40">
          <Text className="text-white text-2xl font-bold">
            {profile.name}, {profile.age}
          </Text>
          <Text className="text-neutral-300">{profile.job}</Text>
        </View>
      </Animated.View>
    </GestureDetector>
  );
}
