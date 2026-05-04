import { useAuth } from "@/auth/AuthProvider";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
        <ActivityIndicator color="white" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  if (!user.name || !user.dob || !user.gender || !user.image) {
    return <Redirect href="/complete-profile" />;
  }

  // if (!user.preferences) {
  //   return <Redirect href="/preferences" />;
  // }

  return <Redirect href="/(tabs)" />;
}