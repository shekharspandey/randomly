import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
};

export default function ChatScreen() {
  const { userId } = useLocalSearchParams();
  const router = useRouter();

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    { id: "1", text: "Hey 👋 How are you?", sender: "other" },
    { id: "2", text: "I’m good! What about you?", sender: "me" },
    { id: "3", text: "All good here 😊", sender: "other" },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: input, sender: "me" },
    ]);
    setInput("");
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LinearGradient
        colors={["#2a0015", "#000000"]}
        className="flex-1"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          {/* Header */}
          <View className="flex-row items-center px-4 pt-16 pb-4">
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>

            <View className="ml-4 flex-row items-center">
              <View className="w-10 h-10 rounded-full bg-gray-600 mr-3" />
              <View>
                <Text className="text-white font-semibold text-base">
                  User {userId}
                </Text>
                <Text className="text-green-400 text-xs">
                  Online
                </Text>
              </View>
            </View>
          </View>

          {/* Messages */}
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            renderItem={({ item }) => (
              <View
                className={`mb-3 max-w-[75%] px-4 py-3 rounded-2xl ${item.sender === "me"
                  ? "self-end bg-pink-500"
                  : "self-start bg-[#2c0a1b]"
                  }`}
              >
                <Text className="text-white">
                  {item.text}
                </Text>
              </View>
            )}
          />

          {/* Input Bar */}
          <View className="absolute bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-transparent">
            <View className="flex-row items-center bg-[#3a0d1f] rounded-full px-4 py-3">
              <TextInput
                placeholder="Type a message..."
                placeholderTextColor="#aaa"
                value={input}
                onChangeText={setInput}
                className="flex-1 text-white"
              />

              <Pressable onPress={sendMessage}>
                <Ionicons name="send" size={20} color="#ff4da6" />
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}
