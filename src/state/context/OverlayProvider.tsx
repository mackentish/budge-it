import React, { Dispatch, SetStateAction } from 'react';

type ContextType = {
  showOverlay: boolean;
  setShowOverlay: Dispatch<SetStateAction<boolean>>;
};

// Initial state
const initialState: ContextType = {
  showOverlay: false,
  setShowOverlay: () => {},
};

// Create context
export const OverlayContext = React.createContext(initialState);
