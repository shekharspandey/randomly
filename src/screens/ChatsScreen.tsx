import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  FlatList,
  Pressable,
  TextInput,
  View
} from "react-native";
import { ScrollView, Text } from "react-native-gesture-handler";

type ChatItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
};

const CHATS: ChatItem[] = [
  {
    id: "1",
    name: "Samantha",
    lastMessage: "Typing...",
    time: "16 mins",
    unreadCount: 4,
    online: true,
  },
  {
    id: "2",
    name: "Nicole",
    lastMessage: "Hey! What’s up, long time no see",
    time: "18 mins",
    unreadCount: 0,
    online: false,
  },
  {
    id: "3",
    name: "Emma Ora",
    lastMessage: "Love you 💕",
    time: "24 mins",
    unreadCount: 2,
    online: true,
  },
  {
    id: "4",
    name: "Natalie",
    lastMessage: "Can you send me the files?",
    time: "1 hr",
    unreadCount: 0,
    online: false,
  },
  {
    id: "5",
    name: "Jennie",
    lastMessage: "Had a great day! 😎",
    time: "2 hr",
    unreadCount: 0,
    online: true,
  }
];

export function ChatsScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#2a0015", "#000000"]}
      className="flex-1"
    >
      <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatRow
            item={item}
            onPress={() => router.push(`/chat/${item.id}`)}
          />
        )}
        ListHeaderComponent={<Header />}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </LinearGradient>
  );
}

function Header() {
  return (
    <View className="pt-16 px-4">
      {/* Search */}
      <View className="bg-[#3a0d1f] rounded-full px-4 py-3 mb-6">
        <TextInput
          placeholder="Search"
          placeholderTextColor="#aaa"
          className="text-white"
        />
      </View>

      {/* Stories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mb-6"
      >
        {["Emma", "Natalie", "Jennie", "Diana"].map((name, index) => (
          <View key={index} className="mr-4 items-center">
            <View className="p-[2px] rounded-full bg-pink-500">
              {/* <View className="w-16 h-16 rounded-full bg-gray-700" /> */}
              <Image
  source={{ uri: `https://picsum.photos/seed/story-${name}/200` }}
  style={{ width: 64, height: 64, borderRadius: 32 }}
  contentFit="cover"
  transition={0}
  cachePolicy="memory-disk"
/>
            </View>
            <Text className="text-white text-xs mt-2">
              {name}
            </Text>
          </View>
        ))}
      </ScrollView>

      <Text className="text-white text-xl font-semibold mb-4">
        Messages
      </Text>
    </View>
  );
}

function ChatRow({
  item,
  onPress,
}: {
  item: ChatItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center px-4 py-3"
    >
      {/* Avatar */}
      <View className="relative mr-3">
        {/* <View className="w-14 h-14 rounded-full bg-gray-600" /> */}
        <Image
  source={{ uri: `https://picsum.photos/seed/user-${item.id}/200` }}
  style={{ width: 56, height: 56, borderRadius: 28 }}
  contentFit="cover"
  transition={0}
  cachePolicy="memory-disk"
/>

        {item.online && (
          <View className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black" />
        )}
      </View>

      {/* Name & Message */}
      <View className="flex-1">
        <Text className="text-white font-semibold text-base">
          {item.name}
        </Text>

        <Text
          className="text-gray-400 text-sm mt-1"
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      {/* Time + Unread */}
      <View className="items-end">
        <Text className="text-gray-500 text-xs">
          {item.time}
        </Text>

        {item.unreadCount > 0 && (
          <View className="mt-2 bg-pink-500 rounded-full min-w-[22px] h-6 px-2 items-center justify-center">
            <Text className="text-white text-xs font-semibold">
              {item.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export function ChatScreen() {
  return (
    <LinearGradient
      colors={["#2a0015", "#000000"]}
      className="flex-1 px-4 pt-16"
    >
      {/* Messages */}
      <View className="flex-1">
        {/* Receiver */}
        <View className="bg-[#2c0a1b] self-start px-4 py-3 rounded-2xl mb-3 max-w-[75%]">
          <Text className="text-white">
            Hey 👋 How are you?
          </Text>
        </View>

        {/* Sender */}
        <View className="bg-pink-500 self-end px-4 py-3 rounded-2xl mb-3 max-w-[75%]">
          <Text className="text-white">
            I'm good! What about you?
          </Text>
        </View>
      </View>

      {/* Input */}
      <View className="flex-row items-center bg-[#3a0d1f] rounded-full px-4 py-3 mb-6">
        <TextInput
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
          className="flex-1 text-white"
        />
      </View>
    </LinearGradient>
  );
}
