import React, { Dispatch, SetStateAction } from 'react';

type ContextType = {
  transactionTags: string[];
  setTransactionTags: Dispatch<SetStateAction<string[]>>;
};

// Initial state
const initialState: ContextType = {
  transactionTags: [],
  setTransactionTags: () => {},
};

// Create context
export const TransactionContext = React.createContext(initialState);
