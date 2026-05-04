import { useAuth } from "@/auth/AuthProvider";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const INTERESTS = ["Gym", "Music", "Travel", "Movies", "Gaming", "Anime", "Food", "Pets"];

export function PreferencesScreen() {
  const router = useRouter();
  const { updateUser } = useAuth();

  const [lookingFor, setLookingFor] = useState("");
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 28]);
  const [distance, setDistance] = useState(25);
  const [bio, setBio] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const toggleInterest = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <LinearGradient colors={["#2a0015", "#000"]} className="flex-1 px-6 pt-20">

      <Text className="text-white text-3xl font-bold mb-6">Preferences</Text>

      {/* Interested In */}
      <Text className="text-gray-400 mb-3">Interested In</Text>
      <View className="flex-row gap-3 mb-6">
        {["men", "women", "everyone"].map((g) => (
          <Pressable
            key={g}
            onPress={() => setLookingFor(g)}
            className={`px-4 py-2 rounded-full ${lookingFor === g ? "bg-pink-500" : "bg-[#2c0a1b]"
              }`}
          >
            <Text className="text-white capitalize">{g}</Text>
          </Pressable>
        ))}
      </View>

      {/* Distance */}
      <Text className="text-gray-400 mb-3">Distance: {distance} km</Text>
      <TextInput
        keyboardType="number-pad"
        value={String(distance)}
        onChangeText={(t) => setDistance(Number(t) || 0)}
        className="bg-[#2c0a1b] text-white px-5 py-3 rounded-xl mb-6"
      />

      {/* Bio */}
      <TextInput
        placeholder="Bio (optional)"
        placeholderTextColor="#aaa"
        value={bio}
        onChangeText={setBio}
        multiline
        className="bg-[#2c0a1b] text-white px-5 py-4 rounded-2xl mb-6 h-28"
      />

      {/* Interests */}
      <Text className="text-gray-400 mb-3">Interests</Text>
      <View className="flex-row flex-wrap gap-3 mb-8">
        {INTERESTS.map((item) => (
          <Pressable
            key={item}
            onPress={() => toggleInterest(item)}
            className={`px-4 py-2 rounded-full ${selected.includes(item) ? "bg-pink-500" : "bg-[#2c0a1b]"
              }`}
          >
            <Text className="text-white">{item}</Text>
          </Pressable>
        ))}
      </View>

      {/* Buttons */}
      <Pressable
        onPress={async () => {
  await updateUser({
    bio,
    preferences: {
      lookingFor,
      ageRange,
      distance,
      interests: selected,
    },
  });

  router.replace("/(tabs)");
}}
        className="bg-pink-500 py-4 rounded-full items-center mb-4"
      >
        <Text className="text-white font-semibold text-lg">Finish</Text>
      </Pressable>

      <Pressable onPress={() => router.replace("/(tabs)")}>
        <Text className="text-center text-gray-400">Skip for now</Text>
      </Pressable>
    </LinearGradient>
  );
}