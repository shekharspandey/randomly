import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/* ─────────────────── types ─────────────────── */
type TickStatus = "sent" | "delivered" | "read";

type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
  /** Only for sender === "me" */
  tickStatus?: TickStatus;
  /** Optional emoji reaction */
  reaction?: string;
};

/* ─────────────────── helpers ─────────────────── */
function nowTime(): string {
  const d = new Date();
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hey 👋 How are you?",
    sender: "other",
    time: "10:30",
    reaction: "❤️",
  },
  {
    id: "2",
    text: "I'm good! What about you?",
    sender: "me",
    time: "10:31",
    tickStatus: "read",
  },
  {
    id: "3",
    text: "All good here 😊 Any plans for the weekend?",
    sender: "other",
    time: "10:32",
  },
  {
    id: "4",
    text: "Maybe a hike! Want to join?",
    sender: "me",
    time: "10:33",
    tickStatus: "delivered",
  },
  {
    id: "5",
    text: "That sounds amazing! I'm in 🎉",
    sender: "other",
    time: "10:34",
  },
  {
    id: "1",
    text: "Hey 👋 How are you?",
    sender: "other",
    time: "10:30",
    reaction: "❤️",
  },
  {
    id: "2",
    text: "I'm good! What about you?",
    sender: "me",
    time: "10:31",
    tickStatus: "read",
  },
  {
    id: "3",
    text: "All good here 😊 Any plans for the weekend?",
    sender: "other",
    time: "10:32",
  },
  {
    id: "4",
    text: "Maybe a hike! Want to join?",
    sender: "me",
    time: "10:33",
    tickStatus: "delivered",
  },
  {
    id: "5",
    text: "That sounds amazing! I'm in 🎉",
    sender: "other",
    time: "10:34",
  },
  {
    id: "1",
    text: "Hey 👋 How are you?",
    sender: "other",
    time: "10:30",
    reaction: "❤️",
  },
  {
    id: "2",
    text: "I'm good! What about you?",
    sender: "me",
    time: "10:31",
    tickStatus: "read",
  },
  {
    id: "3",
    text: "All good here 😊 Any plans for the weekend?",
    sender: "other",
    time: "10:32",
  },
  {
    id: "4",
    text: "Maybe a hike! Want to join?",
    sender: "me",
    time: "10:33",
    tickStatus: "delivered",
  },
  {
    id: "5",
    text: "That sounds amazing! I'm in 🎉",
    sender: "other",
    time: "10:34",
  },
  {
    id: "1",
    text: "Hey 👋 How are you?",
    sender: "other",
    time: "10:30",
    reaction: "❤️",
  },
  {
    id: "2",
    text: "I'm good! What about you?",
    sender: "me",
    time: "10:31",
    tickStatus: "read",
  },
  {
    id: "3",
    text: "All good here 😊 Any plans for the weekend?",
    sender: "other",
    time: "10:32",
  },
  {
    id: "4",
    text: "Maybe a hike! Want to join?",
    sender: "me",
    time: "10:33",
    tickStatus: "delivered",
  },
  {
    id: "5",
    text: "That sounds amazing! I'm in 🎉",
    sender: "other",
    time: "10:34",
  },
  {
    id: "1",
    text: "Hey 👋 How are you?",
    sender: "other",
    time: "10:30",
    reaction: "❤️",
  },
  {
    id: "2",
    text: "I'm good! What about you?",
    sender: "me",
    time: "10:31",
    tickStatus: "read",
  },
  {
    id: "3",
    text: "All good here 😊 Any plans for the weekend?",
    sender: "other",
    time: "10:32",
  },
  {
    id: "4",
    text: "Maybe a hike! Want to join?",
    sender: "me",
    time: "10:33",
    tickStatus: "delivered",
  },
  {
    id: "5",
    text: "That sounds amazing! I'm in 🎉",
    sender: "other",
    time: "10:34",
  },
];

/* ═══════════════════════════════════════════════ */
export default function ChatScreen() {
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [otherTyping, setOtherTyping] = useState(false);
  const listRef = useRef<FlatList>(null);

  /* auto-scroll on new message */
  useEffect(() => {
    setTimeout(
      () => listRef.current?.scrollToEnd({ animated: true }),
      80
    );
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: "me",
      time: nowTime(),
      tickStatus: "sent",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // simulate delivered → read after brief delays
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newMsg.id ? { ...m, tickStatus: "delivered" } : m
        )
      );
      setOtherTyping(true);
    }, 900);

    setTimeout(() => {
      setOtherTyping(false);
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        text: "Got it! 😊",
        sender: "other",
        time: nowTime(),
      };
      setMessages((prev) => [
        ...prev.map((m) =>
          m.id === newMsg.id ? { ...m, tickStatus: "read" } : m
        ),
        reply,
      ]);
    }, 2200);
  };

  /* ─── The mock "other user" details pulled from userId ─── */
  const chatName = `User ${userId}`;
  const avatarUri = `https://picsum.photos/seed/user-${userId}/200`;

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient
        colors={["#1a000d", "#000000"]}
        style={{ flex: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          {/* ─── Header ─── */}
          <ChatHeader
            name={chatName}
            avatarUri={avatarUri}
            onBack={() => router.back()}
          />

          {/* ─── Messages ─── */}
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 12,
              paddingTop: 12,
              paddingBottom: 110,
            }}
            renderItem={({ item, index }) => {
              const prevItem = index > 0 ? messages[index - 1] : null;
              const showTime =
                !prevItem || prevItem.sender !== item.sender;
              return (
                <MessageBubble
                  message={item}
                  showTail={showTime}
                />
              );
            }}
            ListFooterComponent={
              otherTyping ? (
                <View
                  style={{
                    alignSelf: "flex-start",
                    marginLeft: 12,
                    marginTop: 4,
                  }}
                >
                  <TypingIndicator />
                </View>
              ) : null
            }
          />

          {/* ─── Input bar ─── */}
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              paddingBottom: Math.max(insets.bottom, 16),
              paddingTop: 10,
              paddingHorizontal: 12,
              backgroundColor: "rgba(0,0,0,0.85)",
              borderTopWidth: 1,
              borderColor: "rgba(255,255,255,0.06)",
              flexDirection: "row",
              alignItems: "center",    // ← always centered regardless of multiline growth
              gap: 8,
            }}
          >
            {/* Attachment */}
            <View style={{ alignItems: "center", justifyContent: "center", width: 36, height: 44 }}>
              <Pressable hitSlop={8}>
                <Ionicons
                  name="attach-outline"
                  size={24}
                  color="rgba(255,255,255,0.55)"
                />
              </Pressable>
            </View>

            {/* Text field pill */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.09)",
                borderRadius: 22,
                paddingHorizontal: 14,
                paddingVertical: 8,
                gap: 8,
                minHeight: 44,
              }}
            >
              <TextInput
                placeholder="Message…"
                placeholderTextColor="#555"
                value={input}
                onChangeText={setInput}
                multiline
                style={{
                  flex: 1,
                  color: "#fff",
                  fontSize: 15,
                  maxHeight: 100,
                  paddingTop: 0,
                  paddingBottom: 0,
                }}
              />
              {/* Emoji */}
              <Pressable hitSlop={8}>
                <Ionicons
                  name="happy-outline"
                  size={22}
                  color="rgba(255,255,255,0.35)"
                />
              </Pressable>
            </View>

            {/* Send / Camera toggle – always centered */}
            <View style={{ alignItems: "center", justifyContent: "center", width: 44, height: 44 }}>
              {input.trim().length > 0 ? (
                <SendButton onPress={sendMessage} />
              ) : (
                <Pressable hitSlop={8}>
                  <Ionicons
                    name="camera-outline"
                    size={24}
                    color="rgba(255,255,255,0.55)"
                  />
                </Pressable>
              )}
            </View>          {/* ← closes the 44×44 icon wrapper */}
          </View>           {/* ← closes the outer input bar View (line 328) */}
        </KeyboardAvoidingView>
      </LinearGradient>
    </>
  );
}

/* ─────────────────── Chat Header ─────────────────── */
function ChatHeader({
  name,
  avatarUri,
  onBack,
}: {
  name: string;
  avatarUri: string;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingTop: insets.top + 8,
        paddingBottom: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        backgroundColor: "rgba(0,0,0,0.55)",
        gap: 10,
      }}
    >
      {/* Back */}
      <Pressable onPress={onBack} hitSlop={10}>
        <Ionicons name="arrow-back" size={23} color="#fff" />
      </Pressable>

      {/* Avatar + online dot */}
      <Pressable style={{ position: "relative" }}>
        <Image
          source={{ uri: avatarUri }}
          style={{ width: 42, height: 42, borderRadius: 21 }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        <View
          style={{
            position: "absolute",
            bottom: 1,
            right: 1,
            width: 11,
            height: 11,
            backgroundColor: "#22c55e",
            borderRadius: 6,
            borderWidth: 2,
            borderColor: "#000",
          }}
        />
      </Pressable>

      {/* Name + status */}
      <View style={{ flex: 1 }}>
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
          {name}
        </Text>
        <Text style={{ color: "#22c55e", fontSize: 12, marginTop: 1 }}>
          Online
        </Text>
      </View>

      {/* Action buttons */}
      <View style={{ flexDirection: "row", gap: 18, alignItems: "center" }}>
        <Pressable hitSlop={8}>
          <Ionicons name="videocam-outline" size={23} color="#fff" />
        </Pressable>
        <Pressable hitSlop={8}>
          <Ionicons name="call-outline" size={21} color="#fff" />
        </Pressable>
        <Pressable hitSlop={8}>
          <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

/* ─────────────────── Message Bubble ─────────────────── */
function MessageBubble({
  message,
  showTail,
}: {
  message: Message;
  showTail: boolean;
}) {
  const isMe = message.sender === "me";

  const tickIcon =
    message.tickStatus === "sent"
      ? "checkmark-outline"
      : "checkmark-done-outline";
  const tickColor =
    message.tickStatus === "read" ? "#e6007a" : "rgba(255,255,255,0.4)";

  return (
    <View
      style={{
        alignItems: isMe ? "flex-end" : "flex-start",
        marginBottom: showTail ? 6 : 2,
      }}
    >
      <View
        style={{
          maxWidth: "78%",
          backgroundColor: isMe ? "#e6007a" : "rgba(255,255,255,0.08)",
          borderRadius: 18,
          borderBottomRightRadius: isMe && showTail ? 4 : 18,
          borderBottomLeftRadius: !isMe && showTail ? 4 : 18,
          paddingHorizontal: 14,
          paddingVertical: 9,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 15, lineHeight: 21 }}>
          {message.text}
        </Text>

        {/* Time + ticks */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: 4,
            gap: 4,
          }}
        >
          <Text
            style={{
              color: isMe ? "rgba(255,255,255,0.55)" : "#666",
              fontSize: 11,
            }}
          >
            {message.time}
          </Text>
          {isMe && message.tickStatus && (
            <Ionicons name={tickIcon} size={14} color={tickColor} />
          )}
        </View>
      </View>

      {/* Reaction */}
      {message.reaction && (
        <View
          style={{
            marginTop: -6,
            marginLeft: isMe ? undefined : 6,
            marginRight: isMe ? 6 : undefined,
            backgroundColor: "#1a1a1a",
            borderRadius: 10,
            paddingHorizontal: 5,
            paddingVertical: 2,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <Text style={{ fontSize: 13 }}>{message.reaction}</Text>
        </View>
      )}
    </View>
  );
}

/* ─────────────────── Animated Send Button ─────────────────── */
function SendButton({ onPress }: { onPress: () => void }) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scale, {
      toValue: 0.88,
      useNativeDriver: true,
      speed: 40,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      hitSlop={6}
    >
      <Animated.View
        style={{
          transform: [{ scale }],
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: "#e6007a",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: "#e6007a",
          shadowOpacity: 0.5,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 3 },
        }}
      >
        <Ionicons name="send" size={18} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}

/* ─────────────────── Typing Indicator ─────────────────── */
function TypingIndicator() {
  return (
    <View
      style={{
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 18,
        borderBottomLeftRadius: 4,
        paddingHorizontal: 14,
        paddingVertical: 10,
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        marginBottom: 8,
      }}
    >
      {[0, 1, 2].map((i) => (
        <BounceDot key={i} delay={i * 180} />
      ))}
    </View>
  );
}

function BounceDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  const loop = () => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(anim, {
        toValue: -5,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(400),
    ]).start(() => loop());
  };

  useState(() => {
    loop();
  });

  return (
    <Animated.View
      style={{
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#e6007a",
        transform: [{ translateY: anim }],
      }}
    />
  );
}
