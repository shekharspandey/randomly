import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { ReactNode, useMemo, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

 const BOTTOM_SHEET_DEFAULTS = {
  snapPoints: ["70%", "90%"],     // kitna open hoga
  initialIndex: 0,                // open hote hi kaunsa snap
  backdropOpacity: 0.5,           // background dim
  backgroundColor: "#000000",     // sheet bg
  handleColor: "#666666",          // drag indicator
};


type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function AppBottomSheet({ open, onClose, children }: Props) {
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(
    () => BOTTOM_SHEET_DEFAULTS.snapPoints,
    []
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={open ? BOTTOM_SHEET_DEFAULTS.initialIndex : -1}
      snapPoints={snapPoints}
      enablePanDownToClose
      detached              // 🔥 important
      // bottomInset={} // 🔥 tab bar height
      onClose={onClose}
      backdropComponent={(props) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={BOTTOM_SHEET_DEFAULTS.backdropOpacity}
        />
      )}
      backgroundStyle={{
        backgroundColor: BOTTOM_SHEET_DEFAULTS.backgroundColor,
      }}
      handleIndicatorStyle={{
        backgroundColor: BOTTOM_SHEET_DEFAULTS.handleColor,
      }}
    >
      <BottomSheetView className="p-4">
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
}
