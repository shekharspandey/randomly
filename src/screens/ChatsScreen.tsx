import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

/* ─────────────────── types ─────────────────── */
type ChatItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  online: boolean;
  /** "typing" shows animated dots instead of lastMessage */
  typing?: boolean;
  pinned?: boolean;
  muted?: boolean;
  /** "sent" | "delivered" | "read" — only shown for MY last message */
  tickStatus?: "sent" | "delivered" | "read";
  hasStory?: boolean;
};

type StoryUser = { id: string; name: string; seen: boolean };

/* ─────────────────── mock data ─────────────────── */
const STORIES: StoryUser[] = [
  { id: "s1", name: "You", seen: false },
  { id: "s2", name: "Emma", seen: false },
  { id: "s3", name: "Natalie", seen: false },
  { id: "s4", name: "Jennie", seen: true },
  { id: "s5", name: "Diana", seen: true },
  { id: "s6", name: "Riya", seen: false },
];

const ALL_CHATS: ChatItem[] = [
  {
    id: "1",
    name: "Samantha",
    lastMessage: "Typing...",
    time: "now",
    unreadCount: 4,
    online: true,
    typing: true,
    pinned: true,
    hasStory: true,
  },
  {
    id: "2",
    name: "Emma Ora",
    lastMessage: "Love you 💕",
    time: "16 min",
    unreadCount: 2,
    online: true,
    hasStory: true,
  },
  {
    id: "3",
    name: "Nicole",
    lastMessage: "Hey! What's up, long time no see",
    time: "1 hr",
    unreadCount: 0,
    online: false,
    tickStatus: "read",
  },
  {
    id: "4",
    name: "Natalie",
    lastMessage: "Can you send me the files?",
    time: "2 hr",
    unreadCount: 0,
    online: false,
    tickStatus: "delivered",
    muted: true,
  },
  {
    id: "5",
    name: "Jennie",
    lastMessage: "Had a great day! 😎",
    time: "Yesterday",
    unreadCount: 0,
    online: true,
    tickStatus: "sent",
    pinned: true,
  },
  {
    id: "6",
    name: "Diana Prince",
    lastMessage: "Let's catch up soon 🤞",
    time: "Mon",
    unreadCount: 0,
    online: false,
  },
  {
    id: "7",
    name: "Riya Shah",
    lastMessage: "Okay, sounds good!",
    time: "Sun",
    unreadCount: 1,
    online: false,
    hasStory: true,
  },
];

/* ═══════════════════════════════════════════════ */
export function ChatsScreen() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = ALL_CHATS.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <LinearGradient colors={["#1a000d", "#000000"]} style={{ flex: 1 }}>
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatRow item={item} onPress={() => router.push(`/chat/${item.id}`)} />
        )}
        ListHeaderComponent={
          <Header query={query} onQueryChange={setQuery} />
        }
        ListEmptyComponent={
          <View style={{ alignItems: "center", marginTop: 60 }}>
            <Ionicons name="chatbubbles-outline" size={48} color="#555" />
            <Text style={{ color: "#555", marginTop: 12, fontSize: 15 }}>
              No chats found
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: "rgba(255,255,255,0.04)",
              marginLeft: 84,
              marginRight: 16,
            }}
          />
        )}
      />
    </LinearGradient>
  );
}

/* ─────────────────── Header ─────────────────── */
function Header({
  query,
  onQueryChange,
}: {
  query: string;
  onQueryChange: (q: string) => void;
}) {
  return (
    <View style={{ paddingTop: 60, paddingHorizontal: 16, paddingBottom: 4 }}>
      {/* Title row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 26, fontWeight: "800" }}>
          Messages
        </Text>
        <View style={{ flexDirection: "row", gap: 16 }}>
          <Pressable hitSlop={8}>
            <Ionicons name="filter-outline" size={22} color="#fff" />
          </Pressable>
          <Pressable hitSlop={8}>
            <Ionicons name="create-outline" size={22} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Search */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "rgba(255,255,255,0.08)",
          borderRadius: 14,
          paddingHorizontal: 12,
          paddingVertical: 10,
          marginBottom: 20,
          gap: 8,
        }}
      >
        <Ionicons name="search-outline" size={18} color="#888" />
        <TextInput
          placeholder="Search conversations…"
          placeholderTextColor="#666"
          value={query}
          onChangeText={onQueryChange}
          style={{ flex: 1, color: "#fff", fontSize: 14 }}
        />
        {query.length > 0 && (
          <Pressable onPress={() => onQueryChange("")} hitSlop={8}>
            <Ionicons name="close-circle" size={18} color="#666" />
          </Pressable>
        )}
      </View>

      {/* Stories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 16 }}
      >
        {STORIES.map((s) => (
          <StoryBubble key={s.id} story={s} />
        ))}
      </ScrollView>

      {/* Section label */}
      <Text
        style={{
          color: "#666",
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 1.2,
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        Recent
      </Text>
    </View>
  );
}

/* ─────────────────── StoryBubble ─────────────────── */
function StoryBubble({ story }: { story: StoryUser }) {
  const isYou = story.id === "s1";
  return (
    <View style={{ marginRight: 14, alignItems: "center" }}>
      {/* Ring */}
      <View
        style={{
          padding: 2,
          borderRadius: 36,
          background: story.seen
            ? "transparent"
            : undefined,
          borderWidth: story.seen ? 0 : 2,
          borderColor: story.seen ? "transparent" : "#e6007a",
          // gradient ring via shadow trick
          shadowColor: story.seen ? "transparent" : "#e6007a",
          shadowOpacity: story.seen ? 0 : 0.6,
          shadowRadius: story.seen ? 0 : 6,
          shadowOffset: { width: 0, height: 0 },
        }}
      >
        <Image
          source={{ uri: `https://picsum.photos/seed/story-${story.id}/200` }}
          style={{ width: 60, height: 60, borderRadius: 30 }}
          contentFit="cover"
          cachePolicy="memory-disk"
        />
        {isYou && (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              backgroundColor: "#e6007a",
              width: 20,
              height: 20,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: "#000",
            }}
          >
            <Ionicons name="add" size={12} color="#fff" />
          </View>
        )}
      </View>
      <Text
        style={{
          color: "#ccc",
          fontSize: 11,
          marginTop: 5,
          maxWidth: 64,
          textAlign: "center",
        }}
        numberOfLines={1}
      >
        {story.name}
      </Text>
    </View>
  );
}

/* ─────────────────── ChatRow ─────────────────── */
function ChatRow({
  item,
  onPress,
}: {
  item: ChatItem;
  onPress: () => void;
}) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
    }).start();

  const handlePressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();

  const tickColor =
    item.tickStatus === "read" ? "#e6007a" : "rgba(255,255,255,0.35)";

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        {/* Avatar */}
        <View style={{ position: "relative", marginRight: 12 }}>
          <View
            style={{
              borderRadius: 30,
              borderWidth: item.hasStory ? 2 : 0,
              borderColor: item.hasStory ? "#e6007a" : "transparent",
              padding: item.hasStory ? 2 : 0,
            }}
          >
            <Image
              source={{
                uri: `https://picsum.photos/seed/user-${item.id}/200`,
              }}
              style={{ width: 54, height: 54, borderRadius: 27 }}
              contentFit="cover"
              cachePolicy="memory-disk"
            />
          </View>
          {item.online && (
            <View
              style={{
                position: "absolute",
                bottom: 2,
                right: 2,
                width: 12,
                height: 12,
                backgroundColor: "#22c55e",
                borderRadius: 6,
                borderWidth: 2,
                borderColor: "#000",
              }}
            />
          )}
        </View>

        {/* Content */}
        <View style={{ flex: 1 }}>
          {/* Name + time row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 3,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              {item.pinned && (
                <Ionicons name="pin" size={11} color="#e6007a" />
              )}
              <Text
                style={{
                  color: "#fff",
                  fontWeight: "700",
                  fontSize: 15,
                }}
              >
                {item.name}
              </Text>
              {item.muted && (
                <Ionicons name="volume-mute-outline" size={13} color="#666" />
              )}
            </View>

            <Text
              style={{
                color: item.unreadCount > 0 ? "#e6007a" : "#555",
                fontSize: 12,
              }}
            >
              {item.time}
            </Text>
          </View>

          {/* Preview + unread row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                gap: 4,
              }}
            >
              {/* Double tick for MY last message */}
              {item.tickStatus && (
                <Ionicons
                  name={
                    item.tickStatus === "sent"
                      ? "checkmark-outline"
                      : "checkmark-done-outline"
                  }
                  size={15}
                  color={tickColor}
                />
              )}

              {item.typing ? (
                <TypingDots />
              ) : (
                <Text
                  style={{ color: "#777", fontSize: 13 }}
                  numberOfLines={1}
                >
                  {item.lastMessage}
                </Text>
              )}
            </View>

            {item.unreadCount > 0 ? (
              <View
                style={{
                  backgroundColor: "#e6007a",
                  borderRadius: 12,
                  minWidth: 22,
                  height: 22,
                  paddingHorizontal: 6,
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 8,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 11, fontWeight: "800" }}
                >
                  {item.unreadCount}
                </Text>
              </View>
            ) : item.muted ? (
              <Ionicons
                name="volume-mute"
                size={14}
                color="#444"
                style={{ marginLeft: 8 }}
              />
            ) : null}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

/* ─────────────────── Animated typing dots ─────────────────── */
function TypingDots() {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
      {[0, 1, 2].map((i) => (
        <BounceDot key={i} delay={i * 150} />
      ))}
      <Text style={{ color: "#e6007a", fontSize: 12, marginLeft: 2 }}>
        typing
      </Text>
    </View>
  );
}

function BounceDot({ delay }: { delay: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  const bounce = () => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(anim, {
        toValue: -4,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => bounce());
  };

  // start on mount
  useState(() => {
    bounce();
  });

  return (
    <Animated.View
      style={{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#e6007a",
        transform: [{ translateY: anim }],
      }}
    />
  );
}
