import * as SecureStore from 'expo-secure-store';

export async function SetItemAsync(key: string, value: any): Promise<void> {
  return await SecureStore.setItemAsync(key, JSON.stringify(value));
}

export async function GetItemAsync<T>(key: string): Promise<T | null> {
  const stringValue = await SecureStore.getItemAsync(key);
  if (stringValue) return JSON.parse(stringValue) as T;
  return null;
}

export async function DeleteItemAsync(key: string): Promise<void> {
  return await SecureStore.deleteItemAsync(key);
}
