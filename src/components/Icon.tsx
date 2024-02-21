import React from 'react';
import { FontAwesome5, FontAwesome6, Entypo } from '@expo/vector-icons';

export enum IconNames {
  Check = 'check',
  ChevronDown = 'chevron-down',
  ChevronLeft = 'chevron-left',
  ChevronRight = 'chevron-right',
  Dot3 = 'dots-three-horizontal',
  Edit = 'edit',
  Group = 'layer-group',
  Home = 'home',
  Plus = 'plus',
  Settings = 'cogs',
  Summary = 'bar-graph',
  Transaction = 'money-bill-transfer',
  Trash = 'trash-alt',
  X = 'xmark',
}

const fontAwesome6Icons = [
  IconNames.Check,
  IconNames.ChevronDown,
  IconNames.ChevronLeft,
  IconNames.ChevronRight,
  IconNames.Edit,
  IconNames.Group,
  IconNames.Transaction,
  IconNames.X,
];

const fontAwesome5Icons = [IconNames.Home, IconNames.Settings, IconNames.Trash];

const entypoIcons = [IconNames.Dot3, IconNames.Plus, IconNames.Summary];

export function Icon({ name, style }: { name: IconNames; style?: any }) {
  if (fontAwesome6Icons.includes(name)) {
    return <FontAwesome6 name={name} style={style} />;
  } else if (fontAwesome5Icons.includes(name)) {
    return <FontAwesome5 name={name} style={style} />;
  } else if (entypoIcons.includes(name)) {
    return <Entypo name={name} style={style} />;
  }
}
