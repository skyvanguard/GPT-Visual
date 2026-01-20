import React from 'react';
import { Phase } from "./Walkthrough";
import { commentary, embed, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";
import s from './Walkthrough.module.scss';
import { Vec3 } from '@/src/utils/vector';

let minGptLink = 'https://github.com/karpathy/minGPT';
let pytorchLink = 'https://pytorch.org/';
let andrejLink = 'https://karpathy.ai/';
let zeroToHeroLink = 'https://karpathy.ai/zero-to-hero.html';

export function walkthrough01_Prelim(args: IWalkthroughArgs) {
    let { state, walkthrough: wt } = args;

    if (wt.phase !== Phase.Intro_Prelim) {
        return;
    }

    setInitialCamera(state, new Vec3(184.744, 0.000, -636.820), new Vec3(296.000, 16.000, 13.500));

    let c0 = commentary(wt, null, 0)`
Antes de adentrarnos en las complejidades del algoritmo, demos un breve paso atrás.

Esta guía se centra en la _inferencia_, no en el entrenamiento, y como tal es solo una pequeña parte de todo el proceso de aprendizaje automático.
En nuestro caso, los pesos del modelo han sido pre-entrenados, y usamos el proceso de inferencia para generar salidas. Esto se ejecuta directamente en tu navegador.

El modelo mostrado aquí es parte de la familia GPT (generative pre-trained transformer), que puede describirse como un "predictor de tokens basado en contexto".
OpenAI introdujo esta familia en 2018, con miembros notables como GPT-2, GPT-3 y GPT-3.5 Turbo, siendo este último la base del ampliamente usado ChatGPT.
También podría estar relacionado con GPT-4, pero los detalles específicos siguen siendo desconocidos.

Esta guía fue inspirada por el proyecto de GitHub ${embedLink('minGPT', minGptLink)}, una implementación mínima de GPT en ${embedLink('PyTorch', pytorchLink)}
creada por ${embedLink('Andrej Karpathy', andrejLink)}.
Su serie de YouTube ${embedLink("Neural Networks: Zero to Hero", zeroToHeroLink)} y el proyecto minGPT han sido recursos invaluables en la creación de esta
guía. El modelo de juguete presentado aquí está basado en uno encontrado dentro del proyecto minGPT.

¡Muy bien, comencemos!
`;

}

export function embedLink(a: React.ReactNode, href: string) {
    return embedInline(<a className={s.externalLink} href={href} target="_blank" rel="noopener noreferrer">{a}</a>);
}

export function embedInline(a: React.ReactNode) {
    return { insertInline: a };
}


// Another similar model is BERT (bidirectional encoder representations from transformers), a "context-aware text encoder" commonly
// used for tasks like document classification and search.  Newer models like Facebook's LLaMA (large language model architecture), continue to use
// a similar transformer architecture, albeit with some minor differences.
