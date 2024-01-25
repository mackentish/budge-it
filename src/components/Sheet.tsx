import BottomSheet from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { Portal } from '@gorhom/portal';
import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../constants/globalStyle';

export function Sheet({
  bottomSheetRef,
  closeFn = () => {},
  children,
}: {
  bottomSheetRef: React.RefObject<BottomSheetMethods>;
  closeFn?: () => void;
  children: React.ReactNode;
}) {
  const { top } = useSafeAreaInsets();
  const snapPoints = useMemo(() => [Dimensions.get('window').height - top], [top]);

  return (
    <Portal>
      <BottomSheet
        onAnimate={(fromIndex, toIndex) => {
          if (toIndex === -1) closeFn();
        }}
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        backgroundStyle={{ backgroundColor: colors.temp.gray }}
      >
        {children}
      </BottomSheet>
    </Portal>
  );
}
