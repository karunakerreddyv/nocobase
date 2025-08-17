import { useAPIClient } from '@nocobase/client';

export const useTransportsResource = () => {
  const api = useAPIClient();
  return api.resource('transports');
};
