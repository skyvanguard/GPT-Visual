import { Metadata } from "next";

export enum CPUDirectory {
    RiscvBasic,
}

export interface IGuideEntry {
    id: CPUDirectory;
    name: string;
    description?: string;
    path: string;
}

export const guideEntries: IGuideEntry[] = [{
    id: CPUDirectory.RiscvBasic,
    name: 'Computadora Mínima RISC-V',
    description: 'Fundamentos del modelo de CPU RISC-V',
    path: '01-riscv-basic',
}];

export function makeCpuMetadata(dir: CPUDirectory): Metadata {
    let entry = guideEntries.find(x => x.id === dir)!;
    return {
        title: entry.name + ' - Guía de CPU',
        description: entry.description,
        keywords: [],
    };
}
