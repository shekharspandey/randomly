import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Linking, Pressable, ScrollView, Text, View } from "react-native";

type ContentKey = "privacy" | "terms" | "faq";

const CONTENT: Record<ContentKey, { title: string; body: string }> = {
  privacy: {
    title: "Privacy Policy",
    body: "This is privacy policy content...",
  },
  terms: {
    title: "Terms & Conditions",
    body: "These are terms and conditions...",
  },
  faq: {
    title: "FAQs",
    body: "Q1. How does this work?\n\nA: Like this...",
  },
};

export function InfoScreen() {
  const params = useLocalSearchParams();
  const slugParam = params.slug;

  const slug =
    typeof slugParam === "string" ? slugParam : slugParam?.[0];

  const isSupport = slug === "support";
  const data =
    slug && slug in CONTENT
      ? CONTENT[slug as ContentKey]
      : undefined;

  return (
    <>
      {/* Header */}
      <View className="flex-row bg-black items-center px-4 pt-16 pb-4">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>

        <Text className="text-white text-2xl font-bold ml-4">
          {isSupport ? "Support" : data?.title}
        </Text>
      </View>
      <ScrollView className="flex-1 bg-black px-4 pt-4">
        {isSupport ? (
          <View>
            <Text className="text-neutral-300 mb-6">
              Need help? Contact us anytime.
            </Text>

            <Pressable
              onPress={() =>
                Linking.openURL("mailto:support@yourapp.com")
              }
              className="bg-white/10 p-4 rounded-xl mb-3"
            >
              <Text className="text-white">
                📧 support@yourapp.com
              </Text>
            </Pressable>

            <Pressable
              onPress={() =>
                Linking.openURL("tel:+911234567890")
              }
              className="bg-white/10 p-4 rounded-xl"
            >
              <Text className="text-white">
                📞 +91 12345 67890
              </Text>
            </Pressable>
          </View>
        ) : (
          <Text className="text-neutral-300 leading-6">
            {data?.body}
          </Text>
        )}
      </ScrollView>
    </>
  );
}