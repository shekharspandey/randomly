import { useAuth } from "@/auth/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const OPTIONS = [
  { id: "privacy", label: "Privacy Policy" },
  { id: "terms", label: "Terms & Conditions" },
  { id: "faq", label: "FAQs" },
  { id: "support", label: "Support" },
];

export function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("Natalie Morris");
  const [email, setEmail] = useState("natalie@email.com");
  const [avatarSeed, setAvatarSeed] = useState("natalie");

  return (
    <>
      <FlatList
        data={OPTIONS}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            {/* PROFILE SECTION */}
            <View className="bg-black pt-16 px-4 pb-6">
              <Text className="text-white text-2xl font-bold mb-6">
                Settings
              </Text>

              <View className="items-center mb-6">
                <Image
                  source={{
                    uri: user?.image || `https://picsum.photos/seed/${avatarSeed}/300/300`,
                  }}
                  className="w-24 h-24 rounded-full mb-3"
                />

                <Text className="text-white text-lg font-semibold">
                  {user?.name || "John Doe"}
                </Text>

                <Text className="text-neutral-400 text-sm">
                  {user?.phone || ""}
                </Text>

                <Pressable
                  onPress={() => router.push("/edit-profile")}
                  className="mt-4 bg-white/10 px-6 py-2 rounded-full"
                >
                  <Text className="text-white">
                    Update Profile
                  </Text>
                </Pressable>
              </View>

              <View className="h-px bg-neutral-800 mb-4" />
            </View>
          </>
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() => router.push(`/info/${item.id}`)}
            className="px-4 py-4 border-b border-neutral-800 bg-black flex-row justify-between items-center"
          >
            <Text className="text-white">{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#999" />
          </Pressable>
        )}
        ListFooterComponent={
          <View className="bg-black px-4 mt-6">
            <Pressable className="py-4 items-center">
              <Text className="text-red-500 font-semibold" onPress={async () => {
                await logout();
                router.replace("/login");
              }}>
                Logout
              </Text>
            </Pressable>
          </View>
        }
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "black",
          paddingBottom: 40,
        }}
      />

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={editOpen}
        animationType="slide"
        transparent
      >
        <View className="flex-1 bg-black/70 justify-end">
          <View className="bg-[#1a1a1f] p-6 rounded-t-3xl">
            <Text className="text-white text-lg font-semibold mb-4">
              Edit Profile
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Name"
              placeholderTextColor="#666"
              className="bg-black/40 text-white px-4 py-3 rounded-xl mb-3"
            />

            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor="#666"
              className="bg-black/40 text-white px-4 py-3 rounded-xl mb-6"
            />

            <Pressable
              onPress={() => setEditOpen(false)}
              className="bg-white py-3 rounded-full items-center"
            >
              <Text className="text-black font-semibold">
                Save Changes
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}