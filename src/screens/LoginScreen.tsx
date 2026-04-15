import { useAuth } from "@/auth/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);

  const inputs = useRef<TextInput[]>([]);

  /* ---------------- PHONE VALIDATION ---------------- */

  const sendOtp = () => {
    if (phone.length !== 10) {
      setError("Enter a valid 10 digit mobile number");
      return;
    }

    setError("");
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep("otp");
    setTimer(30);
  };

  /* ---------------- OTP INPUT HANDLING ---------------- */

  const handleOtpChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    let newOtp = [...otp];

    // paste full otp
    if (text.length === 4) {
      newOtp = text.split("").slice(0, 4);
      setOtp(newOtp);
      inputs.current[3]?.focus();
      return;
    }

    newOtp[index] = text;
    setOtp(newOtp);

    // move forward
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  /* ---------------- BACKSPACE NAVIGATION ---------------- */

  const handleKeyPress = (key: string, index: number) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  /* ---------------- RESEND TIMER ---------------- */

  useEffect(() => {
    if (step !== "otp" || timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) clearInterval(interval);
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step, timer]);

  const otpComplete = otp.join("").length === 4;

  /* ---------------- UI ---------------- */

  return (
    <LinearGradient colors={["#2a0015", "#000000"]} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 justify-center px-6"
      >
        <Text className="text-white text-4xl font-bold mb-3">Welcome</Text>

        <Text className="text-gray-400 mb-10">
          {step === "phone"
            ? "Enter your phone number to continue"
            : `OTP sent to +91 ${phone}`}
        </Text>

        {/* ---------------- PHONE STEP ---------------- */}
        {step === "phone" && (
          <>
            <View className="bg-[#2c0a1b] rounded-2xl px-5 py-4 flex-row items-center mb-6">
              <Text className="text-white mr-3">+91</Text>

              <TextInput
                keyboardType="number-pad"
                value={phone}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9]/g, "");
                  if (cleaned.length <= 10) setPhone(cleaned);
                  setError("");
                }}
                placeholder="Phone number"
                placeholderTextColor="#aaa"
                className="text-white flex-1 text-lg"
              />
            </View>

            {error ? (
              <Text className="text-red-400 mb-4">{error}</Text>
            ) : null}

            <Pressable
              disabled={phone.length !== 10}
              onPress={sendOtp}
              className={`py-4 rounded-full items-center mb-10 ${phone.length === 10 ? "bg-pink-500" : "bg-pink-900"
                }`}
            >
              <Text className="text-white font-semibold text-lg">
                Continue
              </Text>
            </Pressable>
          </>
        )}

        {/* ---------------- OTP STEP ---------------- */}
        {step === "otp" && (
          <>
            <View className="flex-row justify-between mb-6">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(r) => {
                    if (r) inputs.current[index] = r;
                  }}
                  value={digit}
                  onChangeText={(t) => handleOtpChange(t, index)}
                  onKeyPress={({ nativeEvent }) =>
                    handleKeyPress(nativeEvent.key, index)
                  }
                  keyboardType="number-pad"
                  maxLength={1}
                  className="bg-[#2c0a1b] text-white text-xl text-center rounded-xl w-16 h-16"
                />
              ))}
            </View>

            <Pressable
              disabled={!otpComplete}
              onPress={async () => {
                await login(phone);
                router.replace("/complete-profile");
              }}
              className={`py-4 rounded-full items-center mb-4 ${otpComplete ? "bg-pink-500" : "bg-pink-900"
                }`}
            >
              <Text className="text-white font-semibold text-lg">
                Verify & Continue
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setStep("phone");
                setOtp(["", "", "", ""]);
              }}
            >
              <Text className="text-center text-gray-400 mb-6">
                Edit phone number
              </Text>
            </Pressable>

            {/* RESEND */}
            <Text className="text-center text-gray-400">
              {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive code?"}
            </Text>

            {timer === 0 && (
              <Pressable onPress={sendOtp}>
                <Text className="text-pink-400 text-center mt-2">
                  Resend OTP
                </Text>
              </Pressable>
            )}
          </>
        )}

        {/* ---------------- SOCIAL LOGIN ---------------- */}
        <View className="mt-16">
          <Text className="text-gray-500 text-center mb-6">
            Or continue with
          </Text>

          <View className="flex-row justify-center gap-6">
            <Social icon="logo-google" />
            <Social icon="logo-facebook" />
            <Social icon="logo-apple" />
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

function Social({ icon }: { icon: any }) {
  return (
    <Pressable className="bg-[#1a1a1f] w-14 h-14 rounded-full items-center justify-center">
      <Ionicons name={icon} size={24} color="white" />
    </Pressable>
  );
}