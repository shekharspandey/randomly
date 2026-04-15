import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export function UserCard({ user }: { user: { id: string; name: string } }) {
  const router = useRouter();

  return (
    <View className="bg-neutral-900 rounded-xl p-4 mb-3 flex-row justify-between items-center">
      <Text className="text-white">{user.name}</Text>

      <Pressable
        onPress={() => router.push(`/call/${user.id}`)}
        className="bg-green-500 px-4 py-2 rounded-lg"
      >
        <Text className="text-black font-semibold">Call</Text>
      </Pressable>
    </View>
  );
}
