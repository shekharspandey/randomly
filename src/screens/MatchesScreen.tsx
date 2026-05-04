import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const HORIZONTAL_PADDING = 24;
const GAP = 16;

const CARD_WIDTH =
  (width - HORIZONTAL_PADDING * 2 - GAP) / 2;

const DATA = [
  {
    id: "1",
    name: "Natalie Morris",
    age: 25,
    profession: "Fashion Designer",
    match: 89,
    image: "https://picsum.photos/seed/1/600/800",
  },
  {
    id: "2",
    name: "Jennie Karao",
    age: 20,
    profession: "UI Designer",
    match: 90,
    image: "https://picsum.photos/seed/2/600/800",
  },
  {
    id: "3",
    name: "Emma Ora",
    age: 24,
    profession: "Comedian",
    match: 89,
    image: "https://picsum.photos/seed/3/600/800",
  },
  {
    id: "4",
    name: "Diana Morans",
    age: 32,
    profession: "Influencer",
    match: 100,
    image: "https://picsum.photos/seed/4/600/800",
  },
  {
    id: "5",
    name: "Maria Sams",
    age: 25,
    profession: "Doctor",
    match: 78,
    image: "https://picsum.photos/seed/5/600/800",
  },
];

const repeatedData = Array(5)
  .fill(DATA)
  .flat()
  .map((item, index) => ({
    ...item,
    id: item.id + "-" + index,
  }));

export function MatchesScreen() {
  const [tab, setTab] = useState<"matches" | "foryou">("matches");

  return (
    <LinearGradient
      colors={["#2a0015", "#000000"]}
      className="flex-1"
    >
      {/* HEADER TABS */}
      <View className="pt-16 pb-6 flex-row justify-center gap-8">
        <Pressable onPress={() => setTab("matches")}>
          <Text
            className={`text-lg ${tab === "matches"
              ? "text-white border-b-2 border-white pb-1"
              : "text-gray-500"
              }`}
          >
            Matches
          </Text>
        </Pressable>

        <Pressable onPress={() => setTab("foryou")}>
          <Text
            className={`text-lg ${tab === "foryou"
              ? "text-white border-b-2 border-white pb-1"
              : "text-gray-500"
              }`}
          >
            For You
          </Text>
        </Pressable>
      </View>

      {/* GRID */}
      <FlatList
        data={repeatedData}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{
          paddingHorizontal: HORIZONTAL_PADDING,
        }}
        columnWrapperStyle={{
          gap: GAP,
        }}
        renderItem={({ item }) => (
          <MatchCard item={item} />
        )}
      />
    </LinearGradient>
  );
}

function MatchCard({ item }: any) {
  return (
    <Pressable
      style={{
        width: CARD_WIDTH,
        height: CARD_WIDTH * 1.3,
        marginBottom: GAP,
      }}
      className="rounded-3xl overflow-hidden"
    >
      <Image
        source={{ uri: item.image }}
        style={{ width: "100%", height: "100%" }}
      />

      {/* Overlay Gradient */}
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          padding: 12,
        }}
      >
        <Text className="text-white font-semibold">
          {item.name}, {item.age}
        </Text>
        <Text className="text-gray-300 text-xs">
          {item.profession}
        </Text>
      </LinearGradient>

      {/* Match Badge */}
      <View
        style={{
          position: "absolute",
          top: 10,
          right: 10,
        }}
        className="bg-pink-500 px-3 py-1 rounded-full"
      >
        <Text className="text-white text-xs font-semibold">
          ❤ {item.match}% match
        </Text>
      </View>
    </Pressable>
  );
}