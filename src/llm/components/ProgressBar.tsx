'use client';

import React, { useEffect, useState } from 'react';
import { useProgramState } from '../Sidebar';
import s from './ProgressBar.module.scss';
import { Phase } from '../walkthrough/Walkthrough';

const phaseOrder = [
    Phase.Intro_Intro,
    Phase.Intro_Prelim,
    Phase.Input_Detail_Embedding,
    Phase.Input_Detail_LayerNorm,
    Phase.Input_Detail_SelfAttention,
    Phase.Input_Detail_Softmax,
    Phase.Input_Detail_Projection,
    Phase.Input_Detail_Mlp,
    Phase.Input_Detail_Transformer,
    Phase.Input_Detail_Output,
    Phase.Training_Overview,
];

export function ProgressBar() {
    const progState = useProgramState();
    const [progress, setProgress] = useState(0);
    const [currentPhaseIdx, setCurrentPhaseIdx] = useState(0);

    useEffect(() => {
        if (!progState?.walkthrough) return;

        const updateProgress = () => {
            const wt = progState.walkthrough;
            const phaseIdx = phaseOrder.indexOf(wt.phase);
            if (phaseIdx === -1) return;

            setCurrentPhaseIdx(phaseIdx);

            const phaseProgress = wt.phaseLength > 0 ? wt.time / wt.phaseLength : 0;
            const totalProgress = ((phaseIdx + phaseProgress) / phaseOrder.length) * 100;
            setProgress(Math.min(100, totalProgress));
        };

        updateProgress();
        const interval = setInterval(updateProgress, 100);
        return () => clearInterval(interval);
    }, [progState]);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!progState?.walkthrough) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        const targetPhaseIdx = Math.floor(percentage * phaseOrder.length);

        if (targetPhaseIdx >= 0 && targetPhaseIdx < phaseOrder.length) {
            progState.walkthrough.phase = phaseOrder[targetPhaseIdx];
            progState.walkthrough.time = 0;
            progState.walkthrough.running = false;
            progState.markDirty();
        }
    };

    return (
        <div className={s.container}>
            <div className={s.progressBar} onClick={handleClick} role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className={s.fill} style={{ width: `${progress}%` }} />
                <div className={s.markers}>
                    {phaseOrder.map((_, idx) => (
                        <div
                            key={idx}
                            className={`${s.marker} ${idx <= currentPhaseIdx ? s.completed : ''}`}
                            style={{ left: `${(idx / phaseOrder.length) * 100}%` }}
                        />
                    ))}
                </div>
            </div>
            <div className={s.label}>
                {Math.round(progress)}% completado
            </div>
        </div>
    );
}
