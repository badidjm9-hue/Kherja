import { useContext } from 'react';
import { KherjaContext } from '@/contexts/KherjaContext';
export function useKherja() {
  const value = useContext(KherjaContext);
  if (!value) throw new Error('useKherja must be used within KherjaProvider');
  return value;
}
