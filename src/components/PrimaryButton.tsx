import { Pressable, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
};

export function PrimaryButton({ title, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      className="mt-4 rounded-lg bg-black px-4 py-3"
    >
      <Text className="font-semibold text-white">
        {title}
      </Text>
    </Pressable>
  );
}
