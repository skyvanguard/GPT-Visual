import { createShaderProgram, IGLContext } from "@/src/utils/shader";
import { Mat4f } from "@/src/utils/matrix";
import { Vec3, Vec4 } from "@/src/utils/vector";
import { modelViewUboText, UboBindings } from "./sharedRender";
import { FlowParticleSystem, IParticle } from "../components/FlowParticles";

export type IParticleRender = ReturnType<typeof initParticleRender>;

export function initParticleRender(ctx: IGLContext | null) {
    if (!ctx) {
        return null!;
    }
    let gl = ctx.gl;

    const vertShader = /*glsl*/`#version 300 es
        precision highp float;

        ${modelViewUboText}

        layout(location = 0) in vec3 a_position;
        layout(location = 1) in vec4 a_color;
        layout(location = 2) in float a_size;

        out vec4 v_color;

        void main() {
            vec4 viewPos = u_view * u_model * vec4(a_position, 1.0);
            gl_Position = viewPos;
            gl_PointSize = a_size * 100.0 / -viewPos.z; // Size decreases with distance
            v_color = a_color;
        }
    `;

    const fragShader = /*glsl*/`#version 300 es
        precision highp float;

        in vec4 v_color;
        out vec4 o_color;

        void main() {
            // Create a soft circular particle
            vec2 coord = gl_PointCoord - vec2(0.5);
            float dist = length(coord);

            if (dist > 0.5) {
                discard;
            }

            // Smooth falloff from center
            float alpha = 1.0 - smoothstep(0.0, 0.5, dist);

            // Glow effect
            float glow = exp(-dist * 4.0) * 0.5;
            vec3 glowColor = v_color.rgb + glow;

            o_color = vec4(glowColor, v_color.a * alpha);
        }
    `;

    const shader = createShaderProgram(ctx, 'particle', vertShader, fragShader, [],
        { uboBindings: { 'ModelViewUbo': UboBindings.ModelView } })!;

    // Create buffers for particle data
    const positionBuffer = gl.createBuffer()!;
    const colorBuffer = gl.createBuffer()!;
    const sizeBuffer = gl.createBuffer()!;

    // Create VAO
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);

    // Position attribute (location 0)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

    // Color attribute (location 1)
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 0, 0);

    // Size attribute (location 2)
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 1, gl.FLOAT, false, 0, 0);

    gl.bindVertexArray(null);

    // Preallocate typed arrays for particle data
    const maxParticles = 500;
    const positionData = new Float32Array(maxParticles * 3);
    const colorData = new Float32Array(maxParticles * 4);
    const sizeData = new Float32Array(maxParticles);

    return {
        gl,
        shader,
        vao,
        positionBuffer,
        colorBuffer,
        sizeBuffer,
        positionData,
        colorData,
        sizeData,
        particleCount: 0,
    };
}

export function renderParticles(
    particleRender: IParticleRender,
    particleSystem: FlowParticleSystem
) {
    if (!particleRender || !particleRender.shader.ready) {
        return;
    }

    const gl = particleRender.gl;
    const particles = particleSystem.getActiveParticles();

    if (particles.length === 0) {
        return;
    }

    // Fill buffers with particle data
    let count = 0;
    for (const particle of particles) {
        if (count >= 500) break;

        const pos = particleSystem.getParticlePosition(particle);
        const alpha = particleSystem.getParticleAlpha(particle);

        particleRender.positionData[count * 3 + 0] = pos.x;
        particleRender.positionData[count * 3 + 1] = pos.y;
        particleRender.positionData[count * 3 + 2] = pos.z;

        particleRender.colorData[count * 4 + 0] = particle.color.x;
        particleRender.colorData[count * 4 + 1] = particle.color.y;
        particleRender.colorData[count * 4 + 2] = particle.color.z;
        particleRender.colorData[count * 4 + 3] = particle.color.w * alpha;

        particleRender.sizeData[count] = particle.size;

        count++;
    }

    particleRender.particleCount = count;

    if (count === 0) return;

    // Upload data to GPU
    gl.bindBuffer(gl.ARRAY_BUFFER, particleRender.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particleRender.positionData.subarray(0, count * 3), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, particleRender.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particleRender.colorData.subarray(0, count * 4), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, particleRender.sizeBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, particleRender.sizeData.subarray(0, count), gl.DYNAMIC_DRAW);

    // Render particles
    gl.useProgram(particleRender.shader.program);
    gl.bindVertexArray(particleRender.vao);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // Additive blending for glow effect
    gl.depthMask(false); // Don't write to depth buffer

    gl.drawArrays(gl.POINTS, 0, count);

    gl.depthMask(true);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); // Restore normal blending

    gl.bindVertexArray(null);
}
