'use client';

import React, { useState } from 'react';
import s from './MiniMap.module.scss';
import { useProgramState } from '../Sidebar';
import { Phase } from '../walkthrough/Walkthrough';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMap, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ModelSection {
    id: string;
    name: string;
    phase: Phase;
    yStart: number;
    yEnd: number;
    color: string;
}

const modelSections: ModelSection[] = [
    { id: 'embedding', name: 'Embedding', phase: Phase.Input_Detail_Embedding, yStart: 0, yEnd: 10, color: '#22c55e' },
    { id: 'ln1', name: 'LayerNorm 1', phase: Phase.Input_Detail_LayerNorm, yStart: 10, yEnd: 15, color: '#eab308' },
    { id: 'attn', name: 'Self-Attention', phase: Phase.Input_Detail_SelfAttention, yStart: 15, yEnd: 40, color: '#3b82f6' },
    { id: 'proj', name: 'Projection', phase: Phase.Input_Detail_Projection, yStart: 40, yEnd: 50, color: '#8b5cf6' },
    { id: 'ln2', name: 'LayerNorm 2', phase: Phase.Input_Detail_LayerNorm, yStart: 50, yEnd: 55, color: '#eab308' },
    { id: 'mlp', name: 'MLP', phase: Phase.Input_Detail_Mlp, yStart: 55, yEnd: 75, color: '#ec4899' },
    { id: 'output', name: 'Output', phase: Phase.Input_Detail_Output, yStart: 75, yEnd: 100, color: '#f97316' },
];

export function MiniMap() {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const progState = useProgramState();

    const handleSectionClick = (section: ModelSection) => {
        if (!progState?.walkthrough) return;
        progState.walkthrough.phase = section.phase;
        progState.walkthrough.time = 0;
        progState.walkthrough.running = false;
        progState.markDirty();
    };

    const currentPhase = progState?.walkthrough?.phase;
    const currentSection = modelSections.find(s => s.phase === currentPhase);

    return (
        <div className={s.container}>
            <button
                className={s.toggleButton}
                onClick={() => setIsOpen(!isOpen)}
                title="Mini-mapa del modelo"
            >
                <FontAwesomeIcon icon={isOpen ? faTimes : faMap} />
            </button>

            {isOpen && (
                <div className={`${s.minimap} ${isExpanded ? s.expanded : ''}`}>
                    <div className={s.header}>
                        <span>Arquitectura</span>
                        <button onClick={() => setIsExpanded(!isExpanded)}>
                            {isExpanded ? '−' : '+'}
                        </button>
                    </div>

                    <div className={s.model}>
                        <div className={s.modelVisual}>
                            {modelSections.map(section => (
                                <div
                                    key={section.id}
                                    className={`${s.section} ${currentSection?.id === section.id ? s.active : ''}`}
                                    style={{
                                        top: `${section.yStart}%`,
                                        height: `${section.yEnd - section.yStart}%`,
                                        background: section.color
                                    }}
                                    onClick={() => handleSectionClick(section)}
                                    title={section.name}
                                />
                            ))}

                            {/* Flow arrows */}
                            <div className={s.flowArrow}>↓</div>
                        </div>

                        {isExpanded && (
                            <div className={s.legend}>
                                {modelSections.map(section => (
                                    <div
                                        key={section.id}
                                        className={`${s.legendItem} ${currentSection?.id === section.id ? s.active : ''}`}
                                        onClick={() => handleSectionClick(section)}
                                    >
                                        <span className={s.dot} style={{ background: section.color }} />
                                        <span>{section.name}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={s.info}>
                        <div className={s.infoRow}>
                            <span>Capas:</span>
                            <span>3</span>
                        </div>
                        <div className={s.infoRow}>
                            <span>Cabezas:</span>
                            <span>3</span>
                        </div>
                        <div className={s.infoRow}>
                            <span>Params:</span>
                            <span>~85K</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
