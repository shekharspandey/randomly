import { useAuth } from "@/auth/AuthProvider";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

export function CompleteProfileScreen() {
  const router = useRouter();
  const { updateUser } = useAuth();

  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other" | "">("");
  const [error, setError] = useState("");

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const calculateAge = (date: string) => {
    const [d, m, y] = date.split("/").map(Number);
    if (!d || !m || !y) return 0;

    const today = new Date();
    let age = today.getFullYear() - y;
    if (today.getMonth() + 1 < m || (today.getMonth() + 1 === m && today.getDate() < d))
      age--;

    return age;
  };

  const validate = () => {
    if (!image) return "Add profile photo";
    if (!name.trim()) return "Enter your name";
    if (!dob) return "Enter date of birth";
    if (calculateAge(dob) < 18) return "You must be 18+";
    if (!gender) return "Select gender";
    return "";
  };

  const handleNext = async () => {
  const err = validate();
  if (err) return setError(err);

  await updateUser({
    name,
    dob,
    gender,
    image,
  });

  router.push("/preferences");
};

  return (
    <LinearGradient colors={["#2a0015", "#000"]} className="flex-1 px-6 pt-20">
      <Text className="text-white text-3xl font-bold mb-8">Your Profile</Text>

      <View className="items-center mb-8">
        <Pressable onPress={pickImage}>
          {image ? (
            <Image source={{ uri: image }} className="w-32 h-32 rounded-full" />
          ) : (
            <View className="w-32 h-32 rounded-full bg-[#2c0a1b] items-center justify-center">
              <Text className="text-gray-400">Add Photo</Text>
            </View>
          )}
        </Pressable>
      </View>

      <TextInput
        placeholder="Name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
        className="bg-[#2c0a1b] text-white px-5 py-4 rounded-2xl mb-4"
      />

      <TextInput
        placeholder="DOB (DD/MM/YYYY)"
        placeholderTextColor="#aaa"
        value={dob}
        onChangeText={setDob}
        className="bg-[#2c0a1b] text-white px-5 py-4 rounded-2xl mb-4"
      />

      <View className="flex-row justify-between mb-6">
        {["male", "female", "other"].map((g) => (
          <Pressable
            key={g}
            onPress={() => setGender(g as any)}
            className={`px-5 py-3 rounded-full ${gender === g ? "bg-pink-500" : "bg-[#2c0a1b]"
              }`}
          >
            <Text className="text-white capitalize">{g}</Text>
          </Pressable>
        ))}
      </View>

      {error ? <Text className="text-red-400 mb-4">{error}</Text> : null}

      <Pressable onPress={handleNext} className="bg-pink-500 py-4 rounded-full items-center">
        <Text className="text-white font-semibold text-lg">Continue</Text>
      </Pressable>
    </LinearGradient>
  );
}