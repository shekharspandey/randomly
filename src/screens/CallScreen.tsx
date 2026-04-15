import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function CallScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-black justify-between px-4 py-8">
      <Text className="text-white text-lg">
        Connected with User {userId}
      </Text>

      <View className="flex-row justify-around">
        <Pressable className="bg-gray-700 p-4 rounded-full">
          <Text className="text-white">Mute</Text>
        </Pressable>

        <Pressable
          onPress={() => router.back()}
          className="bg-red-500 p-4 rounded-full"
        >
          <Text className="text-white">End</Text>
        </Pressable>
      </View>
    </View>
  );
}
