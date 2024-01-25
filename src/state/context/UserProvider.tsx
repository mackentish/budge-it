import { Dispatch, SetStateAction, createContext } from 'react';

import { User } from '../../types';

type ContextType = {
  user?: User;
  setUser: Dispatch<SetStateAction<User | undefined>>;
};

const initialContext: ContextType = {
  user: undefined,
  setUser: () => {},
};

export const UserContext = createContext<ContextType>(initialContext);
