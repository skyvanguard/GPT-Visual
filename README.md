# GPT-Visual

<div align="center">

![GPT-Visual Banner](public/images/llm-viz-screenshot2.png)

**Visualización 3D interactiva de modelos de lenguaje grande (LLM) tipo GPT**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)](https://www.typescriptlang.org/)
[![WebGL2](https://img.shields.io/badge/WebGL-2.0-red)](https://www.khronos.org/webgl/)

[Demo en Vivo](#demo) · [Características](#características) · [Instalación](#instalación) · [Contribuir](#contribuir)

</div>

---

## Descripción

GPT-Visual es una herramienta educativa que permite explorar y entender cómo funcionan los modelos transformer como GPT-2, GPT-3 y ChatGPT. A través de una visualización 3D interactiva, puedes ver cada operación matemática que ocurre durante la inferencia del modelo.

### Demo

El modelo visualizado realiza una tarea simple: ordenar secuencias de letras (A, B, C) alfabéticamente.

```
Entrada: CBABBC → Salida: ABBBCC
```

---

## Características

### Visualización Principal

- **Modelo 3D interactivo** del nano-GPT (~85,000 parámetros)
- **Navegación libre** con controles de cámara (WASD + mouse)
- **Comparación de modelos** (nano-GPT, GPT-2, GPT-3)

### Recorrido Educativo

| Fase | Descripción |
|------|-------------|
| Introducción | Visión general del modelo transformer |
| Embedding | Cómo se convierten tokens a vectores |
| LayerNorm | Normalización de capas |
| Self-Attention | El corazón del transformer |
| Proyección | Combinación de cabezas de atención |
| MLP | Red feedforward |
| Softmax | Distribución de probabilidades |
| Output | Predicción del siguiente token |
| Entrenamiento | Forward/backward pass, gradientes |

### Herramientas Interactivas

| Herramienta | Descripción |
|-------------|-------------|
| **Timeline Scrubber** | Slider arrastrable para navegar el recorrido |
| **Tooltips** | Información detallada al hover sobre bloques 3D |
| **Heat Maps** | Visualización de activaciones con gradiente de color |
| **Flow Animation** | Partículas animadas mostrando flujo de datos |
| **Glosario** | 20+ términos de ML con definiciones |
| **Ejemplos** | Diferentes casos de entrada interactivos |

### Controles de Teclado

| Tecla | Acción |
|-------|--------|
| `Espacio` | Pausar/Continuar |
| `← →` | Navegar secciones |
| `W A S D` | Mover cámara |
| `Q E` | Zoom in/out |
| `R` | Expandir vista |
| `F` | Enfocar |
| `Esc` | Cerrar paneles |

---

## Tecnologías

| Tecnología | Uso |
|------------|-----|
| **Next.js 13** | Framework React con App Router |
| **React 18** | Interfaz de usuario |
| **TypeScript 5.2** | Tipado estático |
| **WebGL2** | Renderizado 3D de alto rendimiento |
| **WebAssembly** | Cómputos del modelo (escrito en Odin) |
| **Tailwind CSS** | Estilos utilitarios |
| **SCSS Modules** | Estilos de componentes |

---

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/skyvanguard/GPT-Visual.git
cd GPT-Visual

# Instalar dependencias
yarn install

# Iniciar servidor de desarrollo
yarn dev
```

El proyecto estará disponible en `http://localhost:3002`

---

## Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `yarn dev` | Servidor de desarrollo (puerto 3002) |
| `yarn build` | Build de producción |
| `yarn start` | Servidor de producción |
| `yarn typecheck` | Verificar tipos TypeScript |
| `yarn lint` | Ejecutar ESLint |
| `ANALYZE=true yarn build` | Analizar tamaño del bundle |

---

## Estructura del Proyecto

```
src/
├── app/                    # Rutas Next.js (App Router)
│   ├── llm/               # Página principal de visualización
│   └── cpu/               # Simulador de CPU (WIP)
├── llm/                    # Módulo de visualización LLM
│   ├── components/        # UI (Glosario, Settings, Tooltips, etc.)
│   ├── render/            # Pipeline WebGL (blocks, particles, fonts)
│   ├── walkthrough/       # 11 fases del recorrido educativo
│   └── wasm/              # Código Odin para WebAssembly
├── homepage/              # Componentes de landing page
└── utils/                 # Utilidades (vectores, matrices, shaders)
```

---

## Contribuir

Las contribuciones son bienvenidas:

1. Fork del proyecto
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'feat: Agrega nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abrir Pull Request

---

## Licencia

MIT License - ver [LICENSE](LICENSE) para más detalles.

---

## Créditos

- Inspirado en el trabajo de visualización de transformers
- Basado en [minGPT](https://github.com/karpathy/minGPT) de Andrej Karpathy

---

<div align="center">

**[Volver arriba](#gpt-visual)**

</div>
