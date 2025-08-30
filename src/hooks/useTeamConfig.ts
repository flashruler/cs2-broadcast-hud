import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { emit, listen } from '@tauri-apps/api/event';

export interface TeamConfig {
  ctName: string;
  tName: string;
  ctLogoUrl?: string;
  tLogoUrl?: string;
  isCondensed?: boolean;
}

const defaultConfig: TeamConfig = {
  ctName: 'Counter-Terrorists',
  tName: 'Terrorists',
  ctLogoUrl: '',
  tLogoUrl: '',
  isCondensed: false
};

// Load team config from storage
const loadTeamConfig = async (): Promise<TeamConfig> => {
  try {
    const store = await load('team-config.json', { 
      autoSave: false,
      defaults: {}
    });
    const config = await store.get<TeamConfig>('teamConfig');
    console.log('Loading from Tauri store:', config);
    return config || defaultConfig;
  } catch (error) {
    console.error('Failed to load team config:', error);
    return defaultConfig;
  }
};

// Save team config to storage
const saveTeamConfig = async (config: TeamConfig): Promise<TeamConfig> => {
  try {
    console.log('Saving to Tauri store:', config);
    const store = await load('team-config.json', { 
      autoSave: false,
      defaults: {}
    });
    await store.set('teamConfig', config);
    await store.save();
    
    // Emit Tauri event for cross-window communication
    await emit('team-config-updated', config);
    
    return config;
  } catch (error) {
    console.error('Failed to save team config:', error);
    throw error;
  }
};

// Hook to get team config
export const useTeamConfig = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['teamConfig'],
    queryFn: loadTeamConfig,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    const setupListener = async () => {
      try {
        unlisten = await listen<TeamConfig>('team-config-updated', (event) => {
          console.log('Received team config update event:', event.payload);
          queryClient.setQueryData(['teamConfig'], event.payload);
        });
      } catch (error) {
        console.error('Failed to setup event listener:', error);
      }
    };

    setupListener();

    return () => {
      if (unlisten) {
        unlisten();
      }
    };
  }, [queryClient]);

  return query;
};

// Hook to update team config
export const useUpdateTeamConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: saveTeamConfig,
    onSuccess: (data) => {
      console.log('Mutation success, updating cache:', data);
      queryClient.setQueryData(['teamConfig'], data);
    },
  });
};