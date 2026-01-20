'use client';

import React, { useState, useRef, useEffect } from 'react';
import s from './EmbeddingSpace.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faProjectDiagram, faTimes, faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

// Simulated 2D positions for tokens (after PCA projection)
interface TokenPoint {
    token: string;
    x: number;
    y: number;
    layer: number;
    color: string;
}

const generateTokenPositions = (layer: number): TokenPoint[] => {
    // Simulate how tokens cluster differently at different layers
    const layerEffect = layer / 3; // 0 to 1

    return [
        // Token A positions - moves towards "sorted" cluster in deeper layers
        { token: 'A', x: 30 + layerEffect * 20, y: 70 - layerEffect * 30, layer, color: '#ef4444' },
        // Token B positions
        { token: 'B', x: 50, y: 50, layer, color: '#22c55e' },
        // Token C positions
        { token: 'C', x: 70 - layerEffect * 20, y: 30 + layerEffect * 30, layer, color: '#3b82f6' },
        // Second set (from input sequence CBABBC)
        { token: 'C₁', x: 75 - layerEffect * 25, y: 25 + layerEffect * 25, layer, color: '#3b82f6' },
        { token: 'B₁', x: 55 - layerEffect * 5, y: 45 + layerEffect * 5, layer, color: '#22c55e' },
        { token: 'A₁', x: 35 + layerEffect * 15, y: 65 - layerEffect * 25, layer, color: '#ef4444' },
        { token: 'B₂', x: 48 + layerEffect * 2, y: 52 - layerEffect * 2, layer, color: '#22c55e' },
        { token: 'B₃', x: 52 - layerEffect * 2, y: 48 + layerEffect * 2, layer, color: '#22c55e' },
        { token: 'C₂', x: 72 - layerEffect * 22, y: 28 + layerEffect * 22, layer, color: '#3b82f6' },
    ];
};

export function EmbeddingSpace() {
    const [isOpen, setIsOpen] = useState(false);
    const [layer, setLayer] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hoveredToken, setHoveredToken] = useState<string | null>(null);
    const animationRef = useRef<number>();

    const tokens = generateTokenPositions(layer);

    useEffect(() => {
        if (isAnimating) {
            const animate = () => {
                setLayer(prev => {
                    const next = prev + 0.02;
                    if (next >= 3) {
                        setIsAnimating(false);
                        return 3;
                    }
                    return next;
                });
                animationRef.current = requestAnimationFrame(animate);
            };
            animationRef.current = requestAnimationFrame(animate);
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isAnimating]);

    const handlePlayPause = () => {
        if (layer >= 3) {
            setLayer(0);
        }
        setIsAnimating(!isAnimating);
    };

    return (
        <>
            <button className={s.openButton} onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon icon={faProjectDiagram} />
                <span>Espacio de Embeddings</span>
            </button>

            {isOpen && (
                <div className={s.overlay} onClick={() => setIsOpen(false)}>
                    <div className={s.panel} onClick={e => e.stopPropagation()}>
                        <button className={s.closeBtn} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2>Espacio de Embeddings 2D</h2>
                        <p className={s.subtitle}>
                            Visualiza cómo los tokens se agrupan en diferentes capas
                        </p>

                        <div className={s.layerControl}>
                            <span>Capa: <strong>{Math.floor(layer)}</strong></span>
                            <input
                                type="range"
                                min="0"
                                max="3"
                                step="0.1"
                                value={layer}
                                onChange={e => {
                                    setIsAnimating(false);
                                    setLayer(parseFloat(e.target.value));
                                }}
                            />
                            <button className={s.playBtn} onClick={handlePlayPause}>
                                <FontAwesomeIcon icon={isAnimating ? faPause : faPlay} />
                            </button>
                        </div>

                        <div className={s.visualization}>
                            <svg viewBox="0 0 100 100" className={s.canvas}>
                                {/* Grid lines */}
                                <defs>
                                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.2" />
                                    </pattern>
                                </defs>
                                <rect width="100" height="100" fill="url(#grid)" />

                                {/* Cluster regions (approximate) */}
                                <ellipse cx="35" cy="65" rx="15" ry="12" fill="rgba(239, 68, 68, 0.1)" stroke="rgba(239, 68, 68, 0.3)" strokeWidth="0.5" />
                                <ellipse cx="50" cy="50" rx="15" ry="12" fill="rgba(34, 197, 94, 0.1)" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="0.5" />
                                <ellipse cx="65" cy="35" rx="15" ry="12" fill="rgba(59, 130, 246, 0.1)" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.5" />

                                {/* Tokens */}
                                {tokens.map((t, i) => (
                                    <g key={i}>
                                        <circle
                                            cx={t.x}
                                            cy={t.y}
                                            r={hoveredToken === t.token ? 4 : 3}
                                            fill={t.color}
                                            stroke="white"
                                            strokeWidth="0.5"
                                            style={{ transition: 'all 0.3s ease-out' }}
                                            onMouseEnter={() => setHoveredToken(t.token)}
                                            onMouseLeave={() => setHoveredToken(null)}
                                        />
                                        <text
                                            x={t.x}
                                            y={t.y - 5}
                                            textAnchor="middle"
                                            fill="white"
                                            fontSize="3"
                                            fontWeight="bold"
                                        >
                                            {t.token}
                                        </text>
                                    </g>
                                ))}

                                {/* Axis labels */}
                                <text x="95" y="98" fill="rgba(255,255,255,0.5)" fontSize="3">PC1</text>
                                <text x="2" y="5" fill="rgba(255,255,255,0.5)" fontSize="3">PC2</text>
                            </svg>
                        </div>

                        <div className={s.legend}>
                            <div className={s.legendItem}>
                                <span className={s.dot} style={{ background: '#ef4444' }} />
                                <span>Token A</span>
                            </div>
                            <div className={s.legendItem}>
                                <span className={s.dot} style={{ background: '#22c55e' }} />
                                <span>Token B</span>
                            </div>
                            <div className={s.legendItem}>
                                <span className={s.dot} style={{ background: '#3b82f6' }} />
                                <span>Token C</span>
                            </div>
                        </div>

                        <div className={s.info}>
                            <strong>¿Qué muestra esto?</strong>
                            <p>
                                Esta es una proyección 2D (PCA) del espacio de embeddings de 48 dimensiones.
                                Observa cómo los tokens del mismo tipo se agrupan más en capas profundas,
                                mientras que en la capa 0 (entrada) están más mezclados.
                            </p>
                            <p>
                                En modelos reales, las capas profundas desarrollan representaciones
                                más semánticas y abstractas.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
