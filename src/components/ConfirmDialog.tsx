import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";

type Props = {
  /** Controls visibility */
  visible: boolean;
  /** Modal title (e.g. "Logout") */
  title: string;
  /** Descriptive message shown below the title */
  message: string;
  /** Label on the confirm button – defaults to "Confirm" */
  confirmLabel?: string;
  /** Label on the cancel button – defaults to "Cancel" */
  cancelLabel?: string;
  /**
   * When true the confirm button is styled in red (destructive action).
   * Defaults to false.
   */
  danger?: boolean;
  /** Optional icon name from @expo/vector-icons Ionicons set */
  icon?: keyof typeof Ionicons.glyphMap;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
  icon,
  onConfirm,
  onCancel,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 18,
          stiffness: 200,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      {/* Backdrop */}
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.72)", justifyContent: "center", alignItems: "center", paddingHorizontal: 28 }}
        onPress={onCancel}
      >
        {/* Card – stop press from bubbling through */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
            opacity: opacityAnim,
            width: "100%",
          }}
        >
          <Pressable onPress={() => { }} style={{
            backgroundColor: "#18181b",
            borderRadius: 24,
            paddingTop: 32,
            paddingBottom: 24,
            paddingHorizontal: 24,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.07)",
          }}>

            {/* Optional icon */}
            {icon && (
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: danger ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.08)",
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
                marginBottom: 16,
              }}>
                <Ionicons
                  name={icon}
                  size={28}
                  color={danger ? "#ef4444" : "#ffffff"}
                />
              </View>
            )}

            {/* Title */}
            <Text style={{
              color: "#ffffff",
              fontSize: 20,
              fontWeight: "700",
              textAlign: "center",
              marginBottom: 8,
            }}>
              {title}
            </Text>

            {/* Message */}
            <Text style={{
              color: "#a1a1aa",
              fontSize: 14,
              lineHeight: 20,
              textAlign: "center",
              marginBottom: 28,
            }}>
              {message}
            </Text>

            {/* Buttons */}
            <View style={{ flexDirection: "row", gap: 10, justifyContent: "space-around", alignItems: "center", width: "100%" }}>
              {/* Confirm */}
              <Pressable
                onPress={onConfirm}
                style={({ pressed }) => ({
                  backgroundColor: danger
                    ? pressed ? "#b91c1c" : "#ef4444"
                    : pressed ? "#d4d4d8" : "#ffffff",
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: "center",
                  opacity: pressed ? 0.9 : 1,
                })}
              >
                <Text style={{
                  color: danger ? "#ffffff" : "#09090b",
                  fontSize: 15,
                  fontWeight: "700",
                }}>
                  {confirmLabel}
                </Text>
              </Pressable>

              {/* Cancel */}
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
                  paddingVertical: 14,
                  borderRadius: 14,
                  alignItems: "center",
                })}
              >
                <Text style={{
                  color: "#a1a1aa",
                  fontSize: 15,
                  fontWeight: "600",
                }}>
                  {cancelLabel}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
