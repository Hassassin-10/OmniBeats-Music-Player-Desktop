import { useEffect } from 'react';
import { useAudioStore } from '../store/useAudioStore';

export const useTrayIPC = () => {

    useEffect(() => {
        if (!window.electronAPI?.onTrayCommand) return;

        const removeListener = window.electronAPI.onTrayCommand((command: string) => {
            console.log('Tray command received:', command);
            switch (command) {
                case 'tray-play-pause':
                    if (useAudioStore.getState().isPlaying) {
                        useAudioStore.getState().pause();
                    } else {
                        useAudioStore.getState().resume();
                    }
                    break;
                case 'tray-next':
                    useAudioStore.getState().next();
                    break;
                case 'tray-prev':
                    useAudioStore.getState().prev();
                    break;
                default:
                    break;
            }
        });

        return () => {
            if (removeListener) removeListener();
        };
    }, []);
};
