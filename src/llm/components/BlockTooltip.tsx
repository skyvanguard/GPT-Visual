import React, { useMemo } from 'react';
import s from './BlockTooltip.module.scss';
import { IHoverTarget } from '../Program';
import { getBlockValueAtIdx } from './DataFlow';
import { Vec3 } from '@/src/utils/vector';
import { DimStyle, dimStyleColor, dimStyleText } from '../walkthrough/WalkthroughTools';
import { isNotNil } from '@/src/utils/data';
import { IGptModelLayout } from '../GptModelLayout';
import clsx from 'clsx';

interface IBlockTooltipProps {
    hoverTarget: IHoverTarget | null;
    mousePos: Vec3;
    layout: IGptModelLayout;
}

interface ITooltipData {
    blockName: string;
    blockType: 'weight' | 'intermediate' | 'aggregate';
    cellIndex: Vec3;
    value: number | null;
    dimensions: { name: string; size: number; dimStyle: DimStyle }[];
    operation: string | null;
}

function getBlockTypeName(t: 'w' | 'i' | 'a'): string {
    switch (t) {
        case 'w': return 'Peso';
        case 'i': return 'Intermedio';
        case 'a': return 'Agregado';
    }
}

function getBlockTypeClass(t: 'w' | 'i' | 'a'): string {
    switch (t) {
        case 'w': return s.typeWeight;
        case 'i': return s.typeIntermediate;
        case 'a': return s.typeAggregate;
    }
}

function getOperationDescription(blk: IHoverTarget['mainCube']): string | null {
    if (!blk.deps) return null;

    if (blk.deps.dot) {
        return 'Multiplicación matricial (dot product)';
    }
    if (blk.deps.add) {
        if (blk.deps.add.length === 2) {
            return 'Suma residual';
        }
        return 'Suma';
    }

    switch (blk.deps.special) {
        case 2: return 'GELU (activación)';
        case 3: return 'LayerNorm (normalización)';
        case 4: return 'Embedding de entrada';
        case 5: return 'LayerNorm μ (media)';
        case 6: return 'LayerNorm σ (desv. estándar)';
        case 7: return 'Softmax max';
        case 8: return 'Softmax Σexp';
        case 1: return 'Softmax';
        case 9: return 'Atención';
    }

    return null;
}

export const BlockTooltip: React.FC<IBlockTooltipProps> = ({ hoverTarget, mousePos, layout }) => {
    const tooltipData = useMemo((): ITooltipData | null => {
        if (!hoverTarget) return null;

        const { mainCube, mainIdx } = hoverTarget;

        const dimensions: ITooltipData['dimensions'] = [];
        if (mainCube.dimX !== DimStyle.None) {
            dimensions.push({
                name: dimStyleText(mainCube.dimX),
                size: mainCube.cx,
                dimStyle: mainCube.dimX,
            });
        }
        if (mainCube.dimY !== DimStyle.None) {
            dimensions.push({
                name: dimStyleText(mainCube.dimY),
                size: mainCube.cy,
                dimStyle: mainCube.dimY,
            });
        }

        const value = getBlockValueAtIdx(mainCube, mainIdx);

        return {
            blockName: mainCube.name || 'Bloque',
            blockType: mainCube.t === 'w' ? 'weight' : mainCube.t === 'i' ? 'intermediate' : 'aggregate',
            cellIndex: mainIdx,
            value,
            dimensions,
            operation: getOperationDescription(mainCube),
        };
    }, [hoverTarget]);

    if (!tooltipData || !hoverTarget) {
        return null;
    }

    const { mainCube, mainIdx } = hoverTarget;

    // Position tooltip near cursor but ensure it stays on screen
    const tooltipStyle: React.CSSProperties = {
        left: mousePos.x + 15,
        top: mousePos.y - 10,
    };

    return (
        <div className={s.tooltip} style={tooltipStyle}>
            <div className={s.header}>
                <span className={s.blockName}>{tooltipData.blockName}</span>
                <span className={clsx(s.blockType, getBlockTypeClass(mainCube.t))}>
                    {getBlockTypeName(mainCube.t)}
                </span>
            </div>

            <div className={s.section}>
                <div className={s.indexRow}>
                    <span className={s.indexLabel}>Índice:</span>
                    <span className={s.indexValue}>
                        [{mainIdx.x}, {mainIdx.y}]
                    </span>
                </div>

                {tooltipData.dimensions.length > 0 && (
                    <div className={s.dimensions}>
                        {tooltipData.dimensions.map((dim, i) => {
                            const color = dimStyleColor(dim.dimStyle);
                            const colorStyle = { color: color.toHexColor() };
                            const idx = i === 0 ? mainIdx.x : mainIdx.y;
                            return (
                                <div key={dim.name} className={s.dimItem}>
                                    <span className={s.dimName} style={colorStyle}>{dim.name}:</span>
                                    <span className={s.dimValue} style={colorStyle}>
                                        {idx} / {dim.size}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {isNotNil(tooltipData.value) && (
                <div className={s.valueSection}>
                    <span className={s.valueLabel}>Valor:</span>
                    <span className={s.valueNumber}>
                        {tooltipData.value.toFixed(4)}
                    </span>
                </div>
            )}

            {tooltipData.operation && (
                <div className={s.operationSection}>
                    <span className={s.operationLabel}>Operación:</span>
                    <span className={s.operationValue}>{tooltipData.operation}</span>
                </div>
            )}
        </div>
    );
};
