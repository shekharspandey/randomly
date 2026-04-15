import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export function Header({ title, rightIcon, onRightPress }: Props) {
  return (
    <View className="bg-black flex-row items-center justify-between px-4 pt-16 pb-2">
      <Text className="text-white text-2xl font-semibold">
        {title}
      </Text>

      {rightIcon && (
        <Pressable onPress={onRightPress}>
          <Ionicons name={rightIcon} size={22} color="#fff" />
        </Pressable>
      )}
    </View>
  );
}
