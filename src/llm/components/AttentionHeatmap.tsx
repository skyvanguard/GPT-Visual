'use client';

import React, { useState, useMemo } from 'react';
import s from './AttentionHeatmap.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTable, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

// Simulated attention weights for demo (6x6 matrix for 6 tokens)
const generateAttentionWeights = (head: number): number[][] => {
    // Different patterns for different heads
    const patterns = [
        // Head 0: Focus on previous token (local attention)
        [
            [1.0, 0, 0, 0, 0, 0],
            [0.3, 0.7, 0, 0, 0, 0],
            [0.1, 0.3, 0.6, 0, 0, 0],
            [0.05, 0.15, 0.3, 0.5, 0, 0],
            [0.05, 0.1, 0.15, 0.3, 0.4, 0],
            [0.02, 0.08, 0.1, 0.2, 0.3, 0.3],
        ],
        // Head 1: Focus on first token (positional)
        [
            [1.0, 0, 0, 0, 0, 0],
            [0.6, 0.4, 0, 0, 0, 0],
            [0.5, 0.25, 0.25, 0, 0, 0],
            [0.4, 0.2, 0.2, 0.2, 0, 0],
            [0.35, 0.15, 0.15, 0.15, 0.2, 0],
            [0.3, 0.14, 0.14, 0.14, 0.14, 0.14],
        ],
        // Head 2: Spread attention (global)
        [
            [1.0, 0, 0, 0, 0, 0],
            [0.5, 0.5, 0, 0, 0, 0],
            [0.33, 0.33, 0.34, 0, 0, 0],
            [0.25, 0.25, 0.25, 0.25, 0, 0],
            [0.2, 0.2, 0.2, 0.2, 0.2, 0],
            [0.17, 0.17, 0.16, 0.17, 0.17, 0.16],
        ],
    ];
    return patterns[head % patterns.length];
};

const tokens = ['C', 'B', 'A', 'B', 'B', 'C'];

export function AttentionHeatmap() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedHead, setSelectedHead] = useState(0);
    const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

    const weights = useMemo(() => generateAttentionWeights(selectedHead), [selectedHead]);

    const getColor = (value: number) => {
        // Blue gradient: lighter = less attention, darker = more attention
        const intensity = Math.round(value * 255);
        return `rgb(${255 - intensity}, ${255 - intensity * 0.5}, 255)`;
    };

    return (
        <>
            <button className={s.openButton} onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon icon={faTable} />
                <span>Mapa de Atención</span>
            </button>

            {isOpen && (
                <div className={s.overlay} onClick={() => setIsOpen(false)}>
                    <div className={s.panel} onClick={e => e.stopPropagation()}>
                        <button className={s.closeBtn} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2>Matriz de Atención</h2>
                        <p className={s.subtitle}>
                            Visualiza cómo cada token "atiende" a los tokens anteriores
                        </p>

                        <div className={s.headSelector}>
                            <span>Cabeza de atención:</span>
                            <div className={s.headButtons}>
                                {[0, 1, 2].map(head => (
                                    <button
                                        key={head}
                                        className={`${s.headBtn} ${selectedHead === head ? s.active : ''}`}
                                        onClick={() => setSelectedHead(head)}
                                    >
                                        {head + 1}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={s.heatmapContainer}>
                            <div className={s.axisLabel + ' ' + s.yAxis}>Query (consulta)</div>

                            <div className={s.heatmapWrapper}>
                                <div className={s.topTokens}>
                                    {tokens.map((t, i) => (
                                        <div key={i} className={s.token}>{t}</div>
                                    ))}
                                </div>

                                <div className={s.heatmapRow}>
                                    <div className={s.sideTokens}>
                                        {tokens.map((t, i) => (
                                            <div key={i} className={s.token}>{t}</div>
                                        ))}
                                    </div>

                                    <div className={s.heatmap}>
                                        {weights.map((row, rowIdx) => (
                                            <div key={rowIdx} className={s.row}>
                                                {row.map((value, colIdx) => (
                                                    <div
                                                        key={colIdx}
                                                        className={`${s.cell} ${colIdx > rowIdx ? s.masked : ''}`}
                                                        style={{
                                                            backgroundColor: colIdx <= rowIdx ? getColor(value) : 'transparent'
                                                        }}
                                                        onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx })}
                                                        onMouseLeave={() => setHoveredCell(null)}
                                                    >
                                                        {colIdx <= rowIdx && (
                                                            <span className={s.value}>
                                                                {(value * 100).toFixed(0)}%
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={s.axisLabel + ' ' + s.xAxis}>Key (clave)</div>
                            </div>
                        </div>

                        {hoveredCell && hoveredCell.col <= hoveredCell.row && (
                            <div className={s.tooltip}>
                                Token "<strong>{tokens[hoveredCell.row]}</strong>" (posición {hoveredCell.row})
                                atiende a "<strong>{tokens[hoveredCell.col]}</strong>" (posición {hoveredCell.col})
                                con peso <strong>{(weights[hoveredCell.row][hoveredCell.col] * 100).toFixed(1)}%</strong>
                            </div>
                        )}

                        <div className={s.legend}>
                            <div className={s.legendTitle}>
                                <FontAwesomeIcon icon={faInfoCircle} /> Interpretación
                            </div>
                            <div className={s.legendContent}>
                                <p><strong>Cabeza 1:</strong> Atención local - enfoca en tokens recientes</p>
                                <p><strong>Cabeza 2:</strong> Atención posicional - enfoca en el primer token</p>
                                <p><strong>Cabeza 3:</strong> Atención global - distribuye uniformemente</p>
                            </div>
                            <div className={s.colorScale}>
                                <span>0%</span>
                                <div className={s.gradient}></div>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
