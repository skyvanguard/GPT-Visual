'use client';

import { useCallback, useEffect, useState } from 'react';
import { Phase } from '../walkthrough/Walkthrough';

const STORAGE_KEY = 'gpt-visual-progress';

interface Progress {
    lastPhase: Phase;
    completedPhases: Phase[];
    totalTime: number;
    lastVisit: number;
}

const defaultProgress: Progress = {
    lastPhase: Phase.Intro_Intro,
    completedPhases: [],
    totalTime: 0,
    lastVisit: Date.now()
};

export function useProgress() {
    const [progress, setProgress] = useState<Progress>(defaultProgress);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load progress from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved) as Progress;
                setProgress(parsed);
            }
        } catch (err) {
            console.error('Failed to load progress:', err);
        }
        setIsLoaded(true);
    }, []);

    // Save progress to localStorage
    const saveProgress = useCallback((updates: Partial<Progress>) => {
        setProgress(prev => {
            const newProgress = { ...prev, ...updates, lastVisit: Date.now() };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
            } catch (err) {
                console.error('Failed to save progress:', err);
            }
            return newProgress;
        });
    }, []);

    const markPhaseCompleted = useCallback((phase: Phase) => {
        setProgress(prev => {
            if (prev.completedPhases.includes(phase)) return prev;
            const newProgress = {
                ...prev,
                completedPhases: [...prev.completedPhases, phase],
                lastVisit: Date.now()
            };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
            } catch (err) {
                console.error('Failed to save progress:', err);
            }
            return newProgress;
        });
    }, []);

    const updateLastPhase = useCallback((phase: Phase) => {
        saveProgress({ lastPhase: phase });
    }, [saveProgress]);

    const addTime = useCallback((seconds: number) => {
        setProgress(prev => {
            const newProgress = { ...prev, totalTime: prev.totalTime + seconds, lastVisit: Date.now() };
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
            } catch (err) {
                console.error('Failed to save progress:', err);
            }
            return newProgress;
        });
    }, []);

    const resetProgress = useCallback(() => {
        setProgress(defaultProgress);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    const getCompletionPercentage = () => {
        const totalPhases = Object.keys(Phase).length / 2; // Enum has both keys and values
        return Math.round((progress.completedPhases.length / totalPhases) * 100);
    };

    return {
        progress,
        isLoaded,
        saveProgress,
        markPhaseCompleted,
        updateLastPhase,
        addTime,
        resetProgress,
        getCompletionPercentage
    };
}

// Hook to auto-save progress
export function useAutoSaveProgress(currentPhase: Phase | undefined) {
    const { updateLastPhase, markPhaseCompleted, addTime } = useProgress();

    useEffect(() => {
        if (!currentPhase) return;

        updateLastPhase(currentPhase);

        // Track time spent
        const interval = setInterval(() => {
            addTime(10); // Add 10 seconds every 10 seconds
        }, 10000);

        return () => clearInterval(interval);
    }, [currentPhase, updateLastPhase, addTime]);
}
