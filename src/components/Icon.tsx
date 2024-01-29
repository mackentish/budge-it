import React from 'react';
import { createIconSetFromFontello } from '@expo/vector-icons';

import fontelloConfig from '../../assets/fonts/config.json';

const FontelloIcon = createIconSetFromFontello(fontelloConfig, 'Fontello', 'fontello.ttf');

export function Icon({ name, style }: { name: string; style?: any }) {
  return <FontelloIcon name={name} style={style} />;
}
