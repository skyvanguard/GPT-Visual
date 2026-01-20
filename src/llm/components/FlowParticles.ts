import { Vec3, Vec4 } from "@/src/utils/vector";
import { IBlkDef, cellPosition, IModelLayout } from "../GptModelLayout";
import { Dim } from "@/src/utils/vector";
import { lerp } from "@/src/utils/math";

export interface IParticle {
    startPos: Vec3;
    endPos: Vec3;
    progress: number; // 0-1
    speed: number;
    color: Vec4;
    size: number;
    alive: boolean;
}

export interface IFlowPath {
    fromBlock: IBlkDef;
    toBlock: IBlkDef;
    color: Vec4;
    particleCount: number;
    active: boolean;
}

const MAX_PARTICLES = 500;
const PARTICLE_POOL: IParticle[] = [];

// Initialize particle pool
for (let i = 0; i < MAX_PARTICLES; i++) {
    PARTICLE_POOL.push({
        startPos: new Vec3(),
        endPos: new Vec3(),
        progress: 0,
        speed: 1,
        color: new Vec4(1, 1, 1, 1),
        size: 2,
        alive: false,
    });
}

export class FlowParticleSystem {
    private activeParticles: IParticle[] = [];
    private paths: IFlowPath[] = [];
    private layout: IModelLayout | null = null;
    private spawnTimer: number = 0;

    setLayout(layout: IModelLayout) {
        this.layout = layout;
    }

    clearPaths() {
        this.paths = [];
    }

    addPath(fromBlock: IBlkDef, toBlock: IBlkDef, color: Vec4, particleCount: number = 5) {
        this.paths.push({
            fromBlock,
            toBlock,
            color,
            particleCount,
            active: true,
        });
    }

    private getBlockCenter(block: IBlkDef): Vec3 {
        if (!this.layout) return new Vec3();

        const x = cellPosition(this.layout, block, Dim.X, Math.floor(block.cx / 2)) + this.layout.cell * 0.5;
        const y = cellPosition(this.layout, block, Dim.Y, Math.floor(block.cy / 2)) + this.layout.cell * 0.5;
        const z = cellPosition(this.layout, block, Dim.Z, Math.floor(block.cz / 2)) + this.layout.cell * 0.5;

        return new Vec3(x, y, z);
    }

    private spawnParticle(path: IFlowPath): IParticle | null {
        // Find a dead particle from the pool
        const particle = PARTICLE_POOL.find(p => !p.alive);
        if (!particle) return null;

        const startPos = this.getBlockCenter(path.fromBlock);
        const endPos = this.getBlockCenter(path.toBlock);

        // Add some randomness to the start/end positions
        const randomOffset = () => (Math.random() - 0.5) * this.layout!.cell * 2;
        startPos.x += randomOffset();
        startPos.y += randomOffset();
        endPos.x += randomOffset();
        endPos.y += randomOffset();

        particle.startPos = startPos;
        particle.endPos = endPos;
        particle.progress = 0;
        particle.speed = 0.3 + Math.random() * 0.3; // Random speed variation
        particle.color = new Vec4(path.color.x, path.color.y, path.color.z, path.color.w);
        particle.size = 2 + Math.random() * 2;
        particle.alive = true;

        this.activeParticles.push(particle);
        return particle;
    }

    update(dt: number) {
        if (!this.layout) return;

        // Spawn new particles for each active path
        this.spawnTimer += dt;
        if (this.spawnTimer > 0.1) { // Spawn every 100ms
            this.spawnTimer = 0;
            for (const path of this.paths) {
                if (path.active && this.activeParticles.length < MAX_PARTICLES) {
                    this.spawnParticle(path);
                }
            }
        }

        // Update existing particles
        for (let i = this.activeParticles.length - 1; i >= 0; i--) {
            const particle = this.activeParticles[i];

            particle.progress += dt * particle.speed;

            if (particle.progress >= 1) {
                particle.alive = false;
                this.activeParticles.splice(i, 1);
            }
        }
    }

    getActiveParticles(): IParticle[] {
        return this.activeParticles;
    }

    getParticlePosition(particle: IParticle): Vec3 {
        // Use a curved path (quadratic bezier) for more natural flow
        const t = particle.progress;
        const start = particle.startPos;
        const end = particle.endPos;

        // Control point is above the midpoint
        const midX = (start.x + end.x) / 2;
        const midY = (start.y + end.y) / 2;
        const midZ = Math.min(start.z, end.z) - this.layout!.cell * 3;

        const control = new Vec3(midX, midY, midZ);

        // Quadratic bezier: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
        const t1 = 1 - t;
        return new Vec3(
            t1 * t1 * start.x + 2 * t1 * t * control.x + t * t * end.x,
            t1 * t1 * start.y + 2 * t1 * t * control.y + t * t * end.y,
            t1 * t1 * start.z + 2 * t1 * t * control.z + t * t * end.z,
        );
    }

    getParticleAlpha(particle: IParticle): number {
        // Fade in at start and fade out at end
        const t = particle.progress;
        if (t < 0.1) return t / 0.1;
        if (t > 0.9) return (1 - t) / 0.1;
        return 1;
    }

    reset() {
        for (const particle of this.activeParticles) {
            particle.alive = false;
        }
        this.activeParticles = [];
        this.paths = [];
        this.spawnTimer = 0;
    }
}

// Singleton instance
export const flowParticleSystem = new FlowParticleSystem();
