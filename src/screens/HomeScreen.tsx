import { AppBottomSheet } from "@/components/BottomSheet";
import { SwipeCard } from "@/components/SwipeCard";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const PROFILES = Array.from({ length: 1000 }, (_, i) => ({
  id: `user-${i}`,
  name: `User ${i + 1}`,
  age: 18 + (i % 10),
  job: ["Designer", "Developer", "Student", "Artist", "Marketer"][i % 5],
  image: `https://picsum.photos/seed/${i % 50}/1200/1800`
}));

export function HomeScreen() {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const uniqueImages = new Set(PROFILES.map(p => p.image));
    uniqueImages.forEach(uri => {
      Image.prefetch(uri);
    });
  }, []);

  const current = PROFILES[index % PROFILES.length];
  const next = PROFILES[(index + 1) % PROFILES.length];

  const handleSwipe = () => {
    setIndex((prev) => prev + 1);
  };

  return (
    <LinearGradient
      colors={["#2b1055", "#7597de"]}
      className="flex-1"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-16">
        <Text className="text-white text-lg font-semibold">
          Randomly
        </Text>
        <Pressable onPress={() => setOpen(true)}>
          <Ionicons name="filter" size={22} color="#fff" />
        </Pressable>
      </View>


      {/* Card Stack */}
      <View className="flex-1 items-center justify-center px-4">
        {/* ===== Skeleton layer (background) ===== */}
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center px-6"
        >
          <View
            className="absolute w-full h-[75%] rounded-3xl"
            style={{
              backgroundColor: "rgba(255,255,255,0.10)",
              transform: [
                { translateY: -20 },
                { rotate: "-3deg" },
              ],
            }}
          />
          <View
            className="absolute w-full h-[75%] rounded-3xl"
            style={{
              backgroundColor: "rgba(255,255,255, 0.30)",
              transform: [
                { translateY: -24 },
                { rotate: "3deg" },
              ],
            }}
          />
        </View>

        {/* ===== REAL swipe cards (top layer) ===== */}
        <View className="absolute inset-0 items-center justify-center px-6">
          <SwipeCard
            key={next.id}
            profile={next}
            isTop={false}
            onSwiped={() => { }}
          />
          <SwipeCard
            key={current.id}
            profile={current}
            isTop
            onSwiped={handleSwipe}
          />
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row justify-center items-center pb-10">
        <AnimatedIconButton
          icon="close"
          gradient={["#4facfe", "#00f2fe"]}
          size={60}
        />

        <View style={{ width: 28 }} />

        <AnimatedIconButton
          icon="flash"
          gradient={["#a855f7", "#ec4899"]}
          size={74}
        />

        <View style={{ width: 28 }} />

        <AnimatedIconButton
          icon="heart"
          gradient={["#c084fc", "#a855f7"]}
          size={60}
        />
      </View>

      <AppBottomSheet open={open} onClose={() => setOpen(false)}>
        <Text className="text-white text-lg font-semibold mb-4">
          Settings
        </Text>

        <Text className="text-neutral-400">
          Gorhom Bottom Sheet is 🔥
        </Text>
      </AppBottomSheet>
    </LinearGradient>
  );
}

function AnimatedIconButton({
  icon,
  gradient,
  iconColor = "#fff",
  size = 64,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  gradient: readonly [string, string, ...string[]];
  iconColor?: string;
  size?: number;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = withSpring(0.88))}
      onPressOut={() => (scale.value = withSpring(1))}
    >
      <Animated.View style={animatedStyle}>
        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Ionicons
            name={icon}
            size={size * 0.48} // icon auto-scale 🔥
            color={iconColor}
          />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}
