import { Phase } from "./Walkthrough";
import { commentary, DimStyle, dimStyleColor, embed, ITimeInfo, IWalkthroughArgs, moveCameraTo, phaseTools, setInitialCamera } from "./WalkthroughTools";
import s from './Walkthrough.module.scss';
import { Vec3, Vec4 } from "@/src/utils/vector";
import React from "react";
import { IBlkDef } from "../GptModelLayout";
import { IProgramState } from "../Program";
import { lerp, lerpSmoothstep } from "@/src/utils/math";
import { clamp, makeArray } from "@/src/utils/data";
import { drawDataFlow } from "../components/DataFlow";
import { drawDependences } from "../Interaction";
import { dimProps, findSubBlocks, splitGrid } from "../Annotations";
import { Dim } from "@/src/utils/vector";
import { processUpTo, startProcessBefore } from "./Walkthrough00_Intro";

export function walkthrough10_Training(args: IWalkthroughArgs) {
    let { state, layout, walkthrough: wt } = args;
    let { breakAfter, afterTime, c_str, c_blockRef } = phaseTools(state);

    if (wt.phase !== Phase.Training_Overview) {
        return;
    }

    setInitialCamera(state, new Vec3(-147, 0, -744.1), new Vec3(298.5, 23.4, 12.2));

    // Intro
    let c1 = commentary(wt, null, 0)`# ¿Cómo Aprende el Modelo?

Hasta ahora hemos visto cómo el modelo _usa_ sus pesos para hacer predicciones. Pero ¿cómo aprende esos pesos en primer lugar?

${embed(TrainingIntro)}`;

    breakAfter();

    // ============ FORWARD PASS ANIMATION ============
    commentary(wt)`## 1. Forward Pass (Paso hacia adelante)

Primero, el modelo procesa una entrada y genera una predicción. Observa cómo los datos fluyen de arriba hacia abajo:`;

    breakAfter();

    {
        let t_camToTop = afterTime(null, 1.0, 0.3);
        moveCameraTo(state, t_camToTop, new Vec3(14.1, 0, -30.4), new Vec3(286, 14.5, 0.8));

        let t_forwardPass = afterTime(null, 6.0, 0.5);

        // Animate forward pass through the model
        if (t_forwardPass.active) {
            animateForwardPass(state, t_forwardPass, layout);
        }

        let t_camToOutput = afterTime(null, 1.0, 0.3);
        moveCameraTo(state, t_camToOutput, new Vec3(-58.4, 0, -1654.9), new Vec3(271.3, 6.4, 1.1));
    }

    breakAfter();

    // ============ LOSS CALCULATION ============
    commentary(wt)`## 2. Calcular la Pérdida (Loss)

Comparamos la predicción del modelo con la respuesta correcta. La _pérdida_ mide qué tan equivocado está:

${embed(LossFunction)}`;

    breakAfter();

    {
        let t_showOutput = afterTime(null, 2.0, 0.5);

        // Animate output comparison
        if (t_showOutput.active) {
            animateLossCalculation(state, t_showOutput, layout);
        }
    }

    breakAfter();

    // ============ BACKPROPAGATION ============
    commentary(wt)`## 3. Backpropagation

Ahora calculamos cómo cada peso contribuyó al error. Los gradientes fluyen _hacia atrás_, desde la salida hasta la entrada:

${embed(BackpropDiagram)}`;

    breakAfter();

    {
        let t_camToOutput = afterTime(null, 1.0, 0.3);
        moveCameraTo(state, t_camToOutput, new Vec3(-58.4, 0, -1654.9), new Vec3(271.3, 6.4, 1.1));

        let t_backprop = afterTime(null, 8.0, 0.5);

        // Animate backpropagation (reverse flow)
        if (t_backprop.active) {
            animateBackpropagation(state, t_backprop, layout);
        }

        let t_camToTop = afterTime(null, 1.0, 0.3);
        moveCameraTo(state, t_camToTop, new Vec3(14.1, 0, -30.4), new Vec3(286, 14.5, 0.8));
    }

    breakAfter();

    // ============ WEIGHT UPDATE ============
    let weightRef = c_blockRef('pesos', layout.blocks[0].heads[0].qWeightBlock, DimStyle.Weights);

    commentary(wt)`## 4. Actualizar Pesos

Finalmente, ajustamos cada ${weightRef} en la dirección que reduce el error. Observa cómo los pesos (bloques azules) cambian:`;

    breakAfter();

    {
        let t_camToWeights = afterTime(null, 1.0, 0.3);
        moveCameraTo(state, t_camToWeights, new Vec3(-78.7, 0, -274.2), new Vec3(299.4, 14.7, 4.3));

        let t_updateWeights = afterTime(null, 4.0, 0.5);

        // Animate weight updates
        if (t_updateWeights.active) {
            animateWeightUpdate(state, t_updateWeights, layout);
        }
    }

    breakAfter();

    // ============ TRAINING CYCLE ============
    commentary(wt)`## Ciclo de Entrenamiento

Este proceso se repite millones de veces:

${embed(TrainingSummary)}

Con cada iteración, los pesos convergen hacia valores que minimizan la pérdida.`;

    breakAfter();

    {
        let t_fullView = afterTime(null, 1.0, 0.3);
        moveCameraTo(state, t_fullView, new Vec3(-147, 0, -744.1), new Vec3(298.5, 23.4, 12.2));

        let t_trainingCycle = afterTime(null, 6.0, 0.5);

        // Show full training cycle animation
        if (t_trainingCycle.active) {
            animateTrainingCycle(state, t_trainingCycle, layout);
        }
    }

    breakAfter();

    // ============ STATS ============
    commentary(wt)`## Estadísticas de Nano-GPT

${embed(TrainingStats)}

Nuestro pequeño modelo fue entrenado con miles de ejemplos de secuencias desordenadas hasta que aprendió a ordenarlas correctamente.`;

    breakAfter();
}

// ============ ANIMATION FUNCTIONS ============

function animateForwardPass(state: IProgramState, timer: ITimeInfo, layout: any) {
    let activeBlocks = layout.cubes.filter((a: IBlkDef) => a.t !== 'w');
    let totalBlocks = activeBlocks.length;

    let currentPos = timer.t * totalBlocks;
    let currentIdx = Math.floor(currentPos);

    // Highlight blocks as data flows through
    for (let i = 0; i < Math.min(currentIdx + 1, totalBlocks); i++) {
        let blk = activeBlocks[i];
        if (i === currentIdx) {
            blk.highlight = 0.6;
        } else if (i < currentIdx) {
            blk.highlight = 0.1;
            if (blk.access) {
                blk.access.disable = false;
            }
        }
    }

    // Show data flow arrow for current block
    if (currentIdx < totalBlocks) {
        let blk = activeBlocks[currentIdx];
        let subPos = currentPos - currentIdx;

        let dim0 = blk.transpose ? Dim.Y : Dim.X;
        let { cx } = dimProps(blk, dim0);

        let horizPos = lerp(0, cx, subPos);

        splitGrid(layout, blk, dim0, horizPos, 0);

        let blockPos = new Vec3(Math.floor(horizPos), 0, 0);
        drawDependences(state, blk, blockPos);
    }

    // Token colors flowing through
    let tokenOpacity = makeArray(6, 0);
    for (let i = 0; i < 6; i++) {
        tokenOpacity[i] = clamp(timer.t * 2 - i * 0.1, 0, 1);
    }
    state.display.tokenIdxColors = { mixes: tokenOpacity, color2: dimStyleColor(DimStyle.TokenIdx) };
}

function animateLossCalculation(state: IProgramState, timer: ITimeInfo, layout: any) {
    // Flash between prediction and correct answer
    let flashRate = timer.t * 4;
    let flash = Math.sin(flashRate * Math.PI) * 0.5 + 0.5;

    // Highlight output softmax block
    if (layout.logitsSoftmax) {
        layout.logitsSoftmax.highlight = 0.3 + flash * 0.4;
    }

    // Show error colors on output
    let outputColors = makeArray(6, 0);
    for (let i = 0; i < 6; i++) {
        // Simulate error: position 5 has the prediction we're comparing
        if (i === 5) {
            outputColors[i] = flash;
        }
    }
    state.display.tokenOutputColors = {
        color1: new Vec4(1, 0.3, 0.3, 1), // Red for error
        color2: new Vec4(0.3, 1, 0.3, 1), // Green for correct
        mixes: outputColors
    };
}

function animateBackpropagation(state: IProgramState, timer: ITimeInfo, layout: any) {
    let activeBlocks = layout.cubes.filter((a: IBlkDef) => a.t !== 'w');
    let totalBlocks = activeBlocks.length;

    // Reverse the animation - go from output to input
    let reverseT = 1.0 - timer.t;
    let currentPos = reverseT * totalBlocks;
    let currentIdx = Math.floor(currentPos);

    // Gradient color (red/orange for backprop)
    let gradientColor = new Vec4(1.0, 0.4, 0.1, 1.0);

    // Highlight blocks as gradients flow backwards
    for (let i = totalBlocks - 1; i >= Math.max(0, currentIdx); i--) {
        let blk = activeBlocks[i];
        let distFromCurrent = Math.abs(i - currentIdx);

        if (distFromCurrent === 0) {
            blk.highlight = 0.7;
        } else if (distFromCurrent < 3) {
            blk.highlight = 0.4 - distFromCurrent * 0.1;
        }

        // Also highlight associated weight blocks
        highlightAssociatedWeights(layout, blk, timer.t, i === currentIdx);
    }

    // Visual indicator of gradient magnitude
    let gradientMagnitude = Math.sin(timer.t * Math.PI * 3) * 0.3 + 0.7;
    state.display.topOutputOpacity = gradientMagnitude;
}

function highlightAssociatedWeights(layout: any, block: IBlkDef, t: number, isCurrent: boolean) {
    // Find weight blocks near this intermediate block
    let weightBlocks = layout.cubes.filter((a: IBlkDef) => a.t === 'w');

    for (let wBlk of weightBlocks) {
        // Check if weight is spatially close to the current block
        let dist = Math.abs(wBlk.z - block.z);
        if (dist < 50) {
            if (isCurrent) {
                wBlk.highlight = 0.5;
            } else {
                wBlk.highlight = Math.max(wBlk.highlight || 0, 0.1);
            }
        }
    }
}

function animateWeightUpdate(state: IProgramState, timer: ITimeInfo, layout: any) {
    let weightBlocks = layout.cubes.filter((a: IBlkDef) => a.t === 'w');

    // Pulse animation for weight updates
    let pulsePhase = timer.t * 3;

    for (let i = 0; i < weightBlocks.length; i++) {
        let wBlk = weightBlocks[i];

        // Staggered pulse effect
        let localPhase = pulsePhase - i * 0.1;
        let pulse = Math.max(0, Math.sin(localPhase * Math.PI * 2));

        wBlk.highlight = pulse * 0.6;

        // Show "update" effect
        if (pulse > 0.5) {
            wBlk.opacity = 0.8 + pulse * 0.2;
        }
    }
}

function animateTrainingCycle(state: IProgramState, timer: ITimeInfo, layout: any) {
    let activeBlocks = layout.cubes.filter((a: IBlkDef) => a.t !== 'w');
    let weightBlocks = layout.cubes.filter((a: IBlkDef) => a.t === 'w');

    // Complete training cycle: forward -> loss -> backward -> update
    let cyclePhase = timer.t * 4; // 4 phases in the cycle

    if (cyclePhase < 1) {
        // Forward pass
        let forwardT = cyclePhase;
        let idx = Math.floor(forwardT * activeBlocks.length);
        for (let i = 0; i <= Math.min(idx, activeBlocks.length - 1); i++) {
            activeBlocks[i].highlight = i === idx ? 0.5 : 0.1;
        }
    } else if (cyclePhase < 2) {
        // Loss calculation
        let lossT = cyclePhase - 1;
        if (layout.logitsSoftmax) {
            layout.logitsSoftmax.highlight = 0.3 + Math.sin(lossT * Math.PI * 4) * 0.3;
        }
    } else if (cyclePhase < 3) {
        // Backpropagation
        let backT = cyclePhase - 2;
        let reverseIdx = Math.floor((1 - backT) * activeBlocks.length);
        for (let i = activeBlocks.length - 1; i >= Math.max(0, reverseIdx); i--) {
            activeBlocks[i].highlight = i === reverseIdx ? 0.5 : 0.2;
        }
    } else {
        // Weight update
        let updateT = cyclePhase - 3;
        for (let wBlk of weightBlocks) {
            wBlk.highlight = Math.sin(updateT * Math.PI * 2) * 0.4 + 0.2;
        }
    }
}

// ============ REACT COMPONENTS ============

const TrainingIntro: React.FC = () => {
    return <div className={s.trainingBox}>
        <div className={s.trainingDiagram}>
            <div className={s.trainingStep}>
                <div className={s.stepIcon}>📚</div>
                <div className={s.stepLabel}>Datos</div>
            </div>
            <div className={s.trainingArrow}>→</div>
            <div className={s.trainingStep}>
                <div className={s.stepIcon}>🔄</div>
                <div className={s.stepLabel}>Entrenar</div>
            </div>
            <div className={s.trainingArrow}>→</div>
            <div className={s.trainingStep}>
                <div className={s.stepIcon}>✨</div>
                <div className={s.stepLabel}>Modelo</div>
            </div>
        </div>
    </div>;
};

const LossFunction: React.FC = () => {
    return <div className={s.lossBox}>
        <div className={s.lossExample}>
            <div className={s.lossRow}>
                <span className={s.lossLabel}>Predicción:</span>
                <span className={s.lossValue}>A: 70%, B: 20%, C: 10%</span>
            </div>
            <div className={s.lossRow}>
                <span className={s.lossLabel}>Correcto:</span>
                <span className={s.lossValue}>A (100%)</span>
            </div>
            <div className={s.lossRow + ' ' + s.lossResult}>
                <span className={s.lossLabel}>Pérdida:</span>
                <span className={s.lossValue} style={{color: '#22c55e'}}>0.36 (baja)</span>
            </div>
        </div>
    </div>;
};

const BackpropDiagram: React.FC = () => {
    return <div className={s.backpropBox}>
        <div className={s.backpropDiagram}>
            <div className={s.backpropLayer}>Salida (Error)</div>
            <div className={s.backpropArrowDown}>↓ gradientes</div>
            <div className={s.backpropLayer}>Transformer 3</div>
            <div className={s.backpropArrowDown}>↓</div>
            <div className={s.backpropLayer}>Transformer 2</div>
            <div className={s.backpropArrowDown}>↓</div>
            <div className={s.backpropLayer}>Transformer 1</div>
            <div className={s.backpropArrowDown}>↓</div>
            <div className={s.backpropLayer}>Embedding</div>
        </div>
    </div>;
};

const TrainingStats: React.FC = () => {
    return <div className={s.statsBox}>
        <div className={s.statRow}>
            <span className={s.statLabel}>Parámetros:</span>
            <span className={s.statValue}>~85,000</span>
        </div>
        <div className={s.statRow}>
            <span className={s.statLabel}>Capas transformer:</span>
            <span className={s.statValue}>3</span>
        </div>
        <div className={s.statRow}>
            <span className={s.statLabel}>Vocabulario:</span>
            <span className={s.statValue}>3 tokens (A, B, C)</span>
        </div>
    </div>;
};

const TrainingSummary: React.FC = () => {
    return <div className={s.summaryBox}>
        <div className={s.summaryCircle}>
            <div className={s.summaryItem}>1. Forward Pass</div>
            <div className={s.summaryArrow}>↓</div>
            <div className={s.summaryItem}>2. Calcular Loss</div>
            <div className={s.summaryArrow}>↓</div>
            <div className={s.summaryItem}>3. Backpropagation</div>
            <div className={s.summaryArrow}>↓</div>
            <div className={s.summaryItem}>4. Actualizar Pesos</div>
            <div className={s.summaryArrow}>↻</div>
        </div>
    </div>;
};
