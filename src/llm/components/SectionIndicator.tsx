'use client';

import React, { useEffect, useState } from 'react';
import s from './SectionIndicator.module.scss';
import { useProgramState } from '../Sidebar';
import { Phase, PhaseGroup } from '../walkthrough/Walkthrough';

const phaseNames: Partial<Record<Phase, string>> = {
    [Phase.Intro_Intro]: 'Introducción',
    [Phase.Intro_Prelim]: 'Conceptos Básicos',
    [Phase.Input_Detail_Embedding]: 'Embedding',
    [Phase.Input_Detail_LayerNorm]: 'Layer Normalization',
    [Phase.Input_Detail_SelfAttention]: 'Self-Attention',
    [Phase.Input_Detail_Softmax]: 'Softmax',
    [Phase.Input_Detail_Projection]: 'Proyección',
    [Phase.Input_Detail_Mlp]: 'MLP',
    [Phase.Input_Detail_Transformer]: 'Transformer',
    [Phase.Input_Detail_Output]: 'Salida',
    [Phase.Training_Overview]: 'Entrenamiento',
};

const groupNames: Record<PhaseGroup, string> = {
    [PhaseGroup.Intro]: 'Introducción',
    [PhaseGroup.Detailed_Input]: 'Arquitectura',
    [PhaseGroup.Training]: 'Entrenamiento',
};

export function SectionIndicator() {
    const progState = useProgramState();
    const [visible, setVisible] = useState(false);
    const [lastPhase, setLastPhase] = useState<Phase | null>(null);

    const walkthrough = progState?.walkthrough;
    const currentWalkthroughPhase = walkthrough?.phase;

    useEffect(() => {
        if (!walkthrough) return;

        if (currentWalkthroughPhase !== lastPhase) {
            setLastPhase(currentWalkthroughPhase ?? null);
            setVisible(true);

            const timer = setTimeout(() => {
                setVisible(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [walkthrough, currentWalkthroughPhase, lastPhase]);

    if (!progState?.walkthrough) return null;

    const currentPhase = progState.walkthrough.phase;
    const phaseName = phaseNames[currentPhase as Phase] ?? 'Desconocido';

    // Find current group
    let currentGroup: PhaseGroup = PhaseGroup.Detailed_Input;
    for (const group of progState.walkthrough.phaseList) {
        if (group.phases.some(p => p.id === currentPhase)) {
            currentGroup = group.groupId;
            break;
        }
    }
    const groupName = groupNames[currentGroup];

    return (
        <div className={`${s.indicator} ${visible ? s.visible : ''}`}>
            <div className={s.group}>{groupName}</div>
            <div className={s.phase}>{phaseName}</div>
        </div>
    );
}
