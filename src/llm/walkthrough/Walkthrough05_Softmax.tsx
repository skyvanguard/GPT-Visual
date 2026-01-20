import { Vec3 } from "@/src/utils/vector";
import { Phase } from "./Walkthrough";
import { commentary, IWalkthroughArgs, setInitialCamera } from "./WalkthroughTools";

export function walkthrough05_Softmax(args: IWalkthroughArgs) {
    let { walkthrough: wt, state } = args;

    if (wt.phase !== Phase.Input_Detail_Softmax) {
        return;
    }

    setInitialCamera(state, new Vec3(-24.350, 0.000, -1702.195), new Vec3(283.100, 0.600, 1.556));

    let c0 = commentary(wt, null, 0)`

La operación softmax se usa como parte de la auto-atención, como vimos en la sección anterior, y también
aparecerá al final del modelo.

Su objetivo es tomar un vector y normalizar sus valores para que sumen 1.0. Sin embargo, no es tan
simple como dividir por la suma. En cambio, cada valor de entrada primero se exponencia.

  a = exp(x_1)

Esto tiene el efecto de hacer todos los valores positivos. Una vez que tenemos un vector de nuestros valores
exponenciados, podemos dividir cada valor por la suma de todos los valores. Esto asegurará que la suma
de los valores sea 1.0. Como todos los valores exponenciados son positivos, sabemos que los valores resultantes
estarán entre 0.0 y 1.0, lo que proporciona una distribución de probabilidad sobre los valores originales.

Eso es todo para softmax: simplemente exponenciar los valores y luego dividir por la suma.

Sin embargo, hay una ligera complicación. Si alguno de los valores de entrada es bastante grande, entonces los
valores exponenciados serán muy grandes. Terminaremos dividiendo un número grande por un número muy grande,
y esto puede causar problemas con la aritmética de punto flotante.

Una propiedad útil de la operación softmax es que si agregamos una constante a todos los valores de entrada,
el resultado será el mismo. Así que podemos encontrar el valor más grande en el vector de entrada y restarlo
de todos los valores. Esto asegura que el valor más grande sea 0.0, y el softmax permanezca numéricamente
estable.

Veamos la operación softmax en el contexto de la capa de auto-atención. Nuestro vector de entrada
para cada operación softmax es una fila de la matriz de auto-atención (pero solo hasta la diagonal).

Como con la normalización de capa, tenemos un paso intermedio donde almacenamos algunos valores de agregación
para mantener el proceso eficiente.

Para cada fila, almacenamos el valor máximo en la fila y la suma de los valores desplazados y exponenciados.
Luego, para producir la fila de salida correspondiente, podemos realizar un pequeño conjunto de operaciones: restar el
máximo, exponenciar y dividir por la suma.

¿Por qué el nombre "softmax"? La versión "dura" de esta operación, llamada argmax, simplemente encuentra
el valor máximo, lo establece en 1.0 y asigna 0.0 a todos los demás valores. En contraste, la operación
softmax sirve como una versión "más suave" de eso. Debido a la exponenciación involucrada en softmax, el
valor más grande se enfatiza y se empuja hacia 1.0, mientras se mantiene una distribución de probabilidad
sobre todos los valores de entrada. Esto permite una representación más matizada que captura no solo la opción
más probable sino también la probabilidad relativa de otras opciones.
`;

}
