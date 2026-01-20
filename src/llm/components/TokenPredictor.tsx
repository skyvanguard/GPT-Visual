'use client';

import React, { useState, useMemo } from 'react';
import s from './TokenPredictor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWandMagicSparkles, faTimes, faDice, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface PredictionResult {
    token: string;
    probability: number;
    isCorrect: boolean;
}

// Simulated model predictions for sorting task
const getPredictions = (input: string, temperature: number): PredictionResult[] => {
    const sortedInput = input.split('').sort().join('');
    const nextCorrect = sortedInput[input.length] || sortedInput[0];

    // Simulate logits based on what would be correct
    const tokens = ['A', 'B', 'C'];
    const baseLogits = tokens.map(t => {
        if (t === nextCorrect) return 3.0;
        if (t === 'A') return 1.0;
        if (t === 'B') return 0.5;
        return 0.2;
    });

    // Apply temperature
    const scaledLogits = baseLogits.map(l => l / temperature);
    const maxLogit = Math.max(...scaledLogits);
    const expLogits = scaledLogits.map(l => Math.exp(l - maxLogit));
    const sumExp = expLogits.reduce((a, b) => a + b, 0);
    const probs = expLogits.map(e => e / sumExp);

    return tokens.map((t, i) => ({
        token: t,
        probability: probs[i],
        isCorrect: t === nextCorrect
    })).sort((a, b) => b.probability - a.probability);
};

export function TokenPredictor() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('CBA');
    const [temperature, setTemperature] = useState(1.0);
    const [selectedToken, setSelectedToken] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);

    const predictions = useMemo(() => getPredictions(input, temperature), [input, temperature]);

    const handleTokenClick = (token: string) => {
        setSelectedToken(token);
        setHistory([...history, token]);
        setTimeout(() => {
            setInput(input + token);
            setSelectedToken(null);
        }, 500);
    };

    const handleSample = () => {
        // Weighted random sampling based on probabilities
        const rand = Math.random();
        let cumProb = 0;
        for (const pred of predictions) {
            cumProb += pred.probability;
            if (rand < cumProb) {
                handleTokenClick(pred.token);
                break;
            }
        }
    };

    const handleReset = () => {
        setInput('CBA');
        setHistory([]);
    };

    const sortedTarget = input.split('').sort().join('');
    const isComplete = input.length >= 6;

    return (
        <>
            <button className={s.openButton} onClick={() => setIsOpen(true)}>
                <FontAwesomeIcon icon={faWandMagicSparkles} />
                <span>Predictor de Tokens</span>
            </button>

            {isOpen && (
                <div className={s.overlay} onClick={() => setIsOpen(false)}>
                    <div className={s.panel} onClick={e => e.stopPropagation()}>
                        <button className={s.closeBtn} onClick={() => setIsOpen(false)}>
                            <FontAwesomeIcon icon={faTimes} />
                        </button>

                        <h2>Predictor Interactivo</h2>
                        <p className={s.subtitle}>
                            Simula cómo el modelo predice el siguiente token
                        </p>

                        <div className={s.task}>
                            <div className={s.taskLabel}>Tarea: Ordenar alfabéticamente</div>
                            <div className={s.taskFlow}>
                                <div className={s.inputBox}>
                                    <span className={s.label}>Entrada</span>
                                    <span className={s.tokens}>{input.slice(0, 3)}</span>
                                </div>
                                <FontAwesomeIcon icon={faArrowRight} className={s.arrow} />
                                <div className={s.outputBox}>
                                    <span className={s.label}>Objetivo</span>
                                    <span className={s.tokens}>{sortedTarget}</span>
                                </div>
                            </div>
                        </div>

                        <div className={s.currentState}>
                            <div className={s.stateLabel}>Secuencia actual:</div>
                            <div className={s.sequence}>
                                {input.split('').map((char, i) => (
                                    <span key={i} className={`${s.char} ${i >= 3 ? s.predicted : ''}`}>
                                        {char}
                                    </span>
                                ))}
                                {!isComplete && <span className={s.cursor}>|</span>}
                            </div>
                        </div>

                        {!isComplete ? (
                            <>
                                <div className={s.temperatureControl}>
                                    <label>
                                        Temperatura: <strong>{temperature.toFixed(1)}</strong>
                                    </label>
                                    <input
                                        type="range"
                                        min="0.1"
                                        max="2"
                                        step="0.1"
                                        value={temperature}
                                        onChange={e => setTemperature(parseFloat(e.target.value))}
                                    />
                                    <div className={s.tempLabels}>
                                        <span>Determinístico</span>
                                        <span>Creativo</span>
                                    </div>
                                </div>

                                <div className={s.predictions}>
                                    <div className={s.predLabel}>Predicciones del modelo:</div>
                                    {predictions.map(pred => (
                                        <button
                                            key={pred.token}
                                            className={`${s.predictionBar} ${pred.isCorrect ? s.correct : ''} ${selectedToken === pred.token ? s.selected : ''}`}
                                            onClick={() => handleTokenClick(pred.token)}
                                        >
                                            <span className={s.predToken}>{pred.token}</span>
                                            <div className={s.barContainer}>
                                                <div
                                                    className={s.bar}
                                                    style={{ width: `${pred.probability * 100}%` }}
                                                />
                                            </div>
                                            <span className={s.predProb}>
                                                {(pred.probability * 100).toFixed(1)}%
                                            </span>
                                        </button>
                                    ))}
                                </div>

                                <div className={s.actions}>
                                    <button className={s.sampleBtn} onClick={handleSample}>
                                        <FontAwesomeIcon icon={faDice} />
                                        Muestrear
                                    </button>
                                    <button className={s.resetBtn} onClick={handleReset}>
                                        Reiniciar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className={s.complete}>
                                <div className={s.completeIcon}>✨</div>
                                <h3>¡Secuencia completa!</h3>
                                <p>
                                    Resultado: <strong>{input.slice(3)}</strong>
                                    {input.slice(3) === sortedTarget.slice(0, 3) ? (
                                        <span className={s.success}> ✓ Correcto</span>
                                    ) : (
                                        <span className={s.error}> ✗ Incorrecto</span>
                                    )}
                                </p>
                                <button className={s.resetBtn} onClick={handleReset}>
                                    Intentar de nuevo
                                </button>
                            </div>
                        )}

                        <div className={s.info}>
                            <strong>¿Cómo funciona?</strong>
                            <p>
                                El modelo calcula probabilidades para cada token posible.
                                Con temperatura baja (≈0.1), casi siempre elige el más probable.
                                Con temperatura alta (≈2.0), la distribución es más uniforme y el resultado más aleatorio.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
