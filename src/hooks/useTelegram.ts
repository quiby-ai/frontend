import { retrieveRawInitData } from '@telegram-apps/sdk';

export function useTelegram() {
  let initData = '';
  
  try {
    const rawData = retrieveRawInitData();
    initData = rawData || '';
  } catch {
    initData = (window as any)?.Telegram?.WebApp?.initData || '';
  }
  
  return { 
    initData,
    user: null 
  };
}
