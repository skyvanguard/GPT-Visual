import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";

export function walkthrough08_Transformer(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Transformer) {
        return;
    }

    setInitialCamera(state, new Vec3(-135.531, 0.000, -353.905), new Vec3(291.100, 13.600, 5.706));

    let c0 = commentary(wt, null, 0)`

¡Y eso es un bloque transformer completo!

Estos forman la mayor parte de cualquier modelo GPT y se repiten varias veces, con la salida de un
bloque alimentando al siguiente, continuando el camino residual.

Como es común en aprendizaje profundo, es difícil decir exactamente qué está haciendo cada una de estas capas, pero
tenemos algunas ideas generales: las capas anteriores tienden a enfocarse en aprender
características y patrones de bajo nivel, mientras que las capas posteriores aprenden a reconocer y entender
abstracciones y relaciones de alto nivel. En el contexto del procesamiento de lenguaje natural, las
capas inferiores podrían aprender gramática, sintaxis y asociaciones simples de palabras, mientras que las capas superiores
podrían capturar relaciones semánticas más complejas, estructuras de discurso y significado dependiente del contexto.

`;

}
