import React, { useCallback, useRef, useState } from 'react';
import s from './TimelineScrubber.module.scss';
import { IWalkthrough, phaseToGroup } from '../walkthrough/Walkthrough';
import { clamp } from '@/src/utils/data';
import clsx from 'clsx';

interface ITimelineScrubberProps {
    walkthrough: IWalkthrough;
    onTimeChange: (time: number) => void;
}

export const TimelineScrubber: React.FC<ITimelineScrubberProps> = ({ walkthrough, onTimeChange }) => {
    const wt = walkthrough;
    const sliderRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPos, setHoverPos] = useState<number>(0);

    const progress = wt.phaseLength > 0 ? (wt.time / wt.phaseLength) * 100 : 0;

    const getTimeFromPosition = useCallback((clientX: number): number => {
        if (!sliderRef.current) return 0;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = clamp(x / rect.width, 0, 1);
        return percentage * wt.phaseLength;
    }, [wt.phaseLength]);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        const newTime = getTimeFromPosition(e.clientX);
        onTimeChange(newTime);

        const handleMouseMove = (e: MouseEvent) => {
            const newTime = getTimeFromPosition(e.clientX);
            onTimeChange(newTime);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [getTimeFromPosition, onTimeChange]);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!sliderRef.current) return;
        const rect = sliderRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = clamp(x / rect.width, 0, 1);
        setHoverTime(percentage * wt.phaseLength);
        setHoverPos(x);
    }, [wt.phaseLength]);

    const handleMouseLeave = useCallback(() => {
        setHoverTime(null);
    }, []);

    // Get phase markers for visual reference
    const group = phaseToGroup(wt);
    const currentPhaseIdx = group?.phases.findIndex(p => p.id === wt.phase) ?? 0;

    const formatTime = (time: number): string => {
        const seconds = Math.floor(time);
        const ms = Math.floor((time % 1) * 10);
        return `${seconds}.${ms}s`;
    };

    return (
        <div className={s.scrubberContainer}>
            <div className={s.timeDisplay}>
                <span className={s.currentTime}>{formatTime(wt.time)}</span>
                <span className={s.separator}>/</span>
                <span className={s.totalTime}>{formatTime(wt.phaseLength)}</span>
            </div>
            <div
                ref={sliderRef}
                className={clsx(s.sliderTrack, isDragging && s.dragging)}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Progress fill */}
                <div className={s.progressFill} style={{ width: `${progress}%` }} />

                {/* Hover preview */}
                {hoverTime !== null && !isDragging && (
                    <div className={s.hoverIndicator} style={{ left: hoverPos }}>
                        <div className={s.hoverTime}>{formatTime(hoverTime)}</div>
                    </div>
                )}

                {/* Thumb/handle */}
                <div
                    className={clsx(s.thumb, isDragging && s.active)}
                    style={{ left: `${progress}%` }}
                />
            </div>
            <div className={s.phaseInfo}>
                <span className={s.phaseLabel}>Fase {currentPhaseIdx + 1}/{group?.phases.length ?? 1}</span>
            </div>
        </div>
    );
};
