import React from 'react';
import { createIconSetFromFontello } from 'react-native-vector-icons';

import fontelloConfig from '../config.json';

const FontelloIcon = createIconSetFromFontello(fontelloConfig);

export function Icon({ name, style }: { name: string; style?: any }) {
  return <FontelloIcon name={name} style={style} />;
}
