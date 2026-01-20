'use client';

import React, { useState } from 'react';
import s from './ModelComparison.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ModelInfo {
    name: string;
    params: string;
    paramsNum: number;
    layers: number | string;
    heads: number | string;
    context: string;
    year: number;
    color: string;
}

const models: ModelInfo[] = [
    {
        name: 'Nano-GPT',
        params: '85K',
        paramsNum: 85000,
        layers: 3,
        heads: 3,
        context: '6 tokens',
        year: 2023,
        color: '#22c55e'
    },
    {
        name: 'GPT-2 Small',
        params: '124M',
        paramsNum: 124000000,
        layers: 12,
        heads: 12,
        context: '1024',
        year: 2019,
        color: '#3b82f6'
    },
    {
        name: 'GPT-2 Large',
        params: '774M',
        paramsNum: 774000000,
        layers: 36,
        heads: 20,
        context: '1024',
        year: 2019,
        color: '#6366f1'
    },
    {
        name: 'GPT-3',
        params: '175B',
        paramsNum: 175000000000,
        layers: 96,
        heads: 96,
        context: '2048',
        year: 2020,
        color: '#8b5cf6'
    },
    {
        name: 'GPT-4',
        params: '~1.7T',
        paramsNum: 1700000000000,
        layers: '~120',
        heads: '~96',
        context: '128K',
        year: 2023,
        color: '#ec4899'
    }
];

export function ModelComparison() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState<ModelInfo | null>(null);

    const maxParams = models[models.length - 1].paramsNum;

    const getBarWidth = (params: number) => {
        // Use logarithmic scale for visualization
        const logMax = Math.log10(maxParams);
        const logParams = Math.log10(params);
        return (logParams / logMax) * 100;
    };

    return (
        <>
            <button className={s.openButton} onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon icon={faChartBar} />
                <span>Comparar modelos</span>
            </button>

            {isOpen && (
                <div className={s.overlay} onClick={() => setIsOpen(false)}>
                    <div className={s.panel} onClick={e => e.stopPropagation()}>
                        <button className={s.closeBtn} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2>Comparación de Modelos GPT</h2>
                        <p className={s.subtitle}>
                            Desde nuestro pequeño Nano-GPT hasta GPT-4
                        </p>

                        <div className={s.chart}>
                            {models.map((model) => (
                                <div
                                    key={model.name}
                                    className={`${s.modelRow} ${selectedModel?.name === model.name ? s.selected : ''}`}
                                    onClick={() => setSelectedModel(model)}
                                >
                                    <div className={s.modelName}>
                                        <span className={s.dot} style={{ background: model.color }} />
                                        {model.name}
                                    </div>
                                    <div className={s.barContainer}>
                                        <div
                                            className={s.bar}
                                            style={{
                                                width: `${getBarWidth(model.paramsNum)}%`,
                                                background: model.color
                                            }}
                                        />
                                    </div>
                                    <div className={s.params}>{model.params}</div>
                                </div>
                            ))}
                        </div>

                        <div className={s.scaleNote}>
                            Escala logarítmica (cada marca = 10x más parámetros)
                        </div>

                        {selectedModel && (
                            <div className={s.details}>
                                <h3 style={{ color: selectedModel.color }}>{selectedModel.name}</h3>
                                <div className={s.statsGrid}>
                                    <div className={s.stat}>
                                        <span className={s.statLabel}>Parámetros</span>
                                        <span className={s.statValue}>{selectedModel.params}</span>
                                    </div>
                                    <div className={s.stat}>
                                        <span className={s.statLabel}>Capas</span>
                                        <span className={s.statValue}>{selectedModel.layers}</span>
                                    </div>
                                    <div className={s.stat}>
                                        <span className={s.statLabel}>Cabezas</span>
                                        <span className={s.statValue}>{selectedModel.heads}</span>
                                    </div>
                                    <div className={s.stat}>
                                        <span className={s.statLabel}>Contexto</span>
                                        <span className={s.statValue}>{selectedModel.context}</span>
                                    </div>
                                    <div className={s.stat}>
                                        <span className={s.statLabel}>Año</span>
                                        <span className={s.statValue}>{selectedModel.year}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className={s.funFact}>
                            <strong>Dato curioso:</strong> GPT-4 tiene aproximadamente{' '}
                            <span className={s.highlight}>20 millones</span> de veces más parámetros
                            que nuestro Nano-GPT.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
