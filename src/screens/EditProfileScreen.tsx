import { useAuth } from "@/auth/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";

export function EditProfileScreen() {
  const router = useRouter();
  const { user, updateUser } = useAuth();

  // local editable state
  const [image, setImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [gender, setGender] = useState("");
  const [ageRange, setAgeRange] = useState<[number, number]>([18, 30]);

  const [width, setWidth] = useState(0);

  // Load saved data into local state
  useEffect(() => {
    if (!user) return;

    setImage(user.image || null);
    setName(user.name || "");
    setBio(user.bio || "");
    setGender(user.gender || "");
    setAgeRange(user.preferences?.ageRange || [18, 30]);
  }, [user]);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const handleSave = async () => {
    await updateUser({
      name,
      bio,
      gender,
      image,
      preferences: {
        ...user?.preferences,
        ageRange,
      },
    });

    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <LinearGradient colors={["#2a0015", "#000"]} className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 pt-16 pb-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>

          <Text className="text-white text-2xl font-bold ml-4">
            Edit Profile
          </Text>
        </View>

        <ScrollView className="px-6">

          {/* IMAGE */}
          <View className="items-center mb-8">
            <Pressable onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} className="w-32 h-32 rounded-full" />
              ) : (
                <View className="w-32 h-32 rounded-full bg-[#2c0a1b] items-center justify-center">
                  <Text className="text-gray-400">Change Photo</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* NAME */}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#aaa"
            className="bg-[#2c0a1b] text-white px-5 py-4 rounded-2xl mb-4"
          />

          {/* GENDER */}
          <View className="flex-row justify-between mb-6">
            {["male", "female", "other"].map((g) => (
              <Pressable
                key={g}
                onPress={() => setGender(g)}
                className={`px-5 py-3 rounded-full ${gender === g ? "bg-pink-500" : "bg-[#2c0a1b]"
                  }`}
              >
                <Text className="text-white capitalize">{g}</Text>
              </Pressable>
            ))}
          </View>

          {/* BIO */}
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Bio"
            placeholderTextColor="#aaa"
            multiline
            className="bg-[#2c0a1b] text-white px-5 py-4 rounded-2xl mb-8 h-28"
          />

          {/* AGE RANGE */}
          <Text className="text-gray-400 mb-4">
            Match Age Range: {ageRange[0]} - {ageRange[1]}
          </Text>

          <View
            onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
          >
            {width > 0 && (
              <MultiSlider
                sliderLength={width}
                values={[ageRange[0], ageRange[1]]}
                min={18}
                max={60}
                step={1}
                onValuesChange={(values) =>
                  setAgeRange([values[0], values[1]])
                }
                selectedStyle={{ backgroundColor: "#ff2d75" }}
                unselectedStyle={{ backgroundColor: "#333" }}
                markerStyle={{
                  backgroundColor: "#ff2d75",
                  height: 20,
                  width: 20,
                }}
                trackStyle={{
                  height: 4,
                }}
              />
            )}
          </View>

          <Pressable
            onPress={handleSave}
            className="bg-pink-500 py-4 rounded-full items-center mb-20"
          >
            <Text className="text-white font-semibold text-lg">
              Save Changes
            </Text>
          </Pressable>

        </ScrollView>
      </LinearGradient>
    </>
  );
}