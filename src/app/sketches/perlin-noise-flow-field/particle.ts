import p5 from "p5";

export class Particle {
    position;
    previousPosition;
    velocity;
    acceleration;
    force;
    maxVelocity = 4;

    constructor(
        private readonly p: p5,
        private readonly xyOffsetPerPixel: number,
        private readonly noiseWidth: number,
        private readonly edgeWrap: boolean,
    ) {
        this.position = this.p.createVector(this.p.random(this.p.width), this.p.random(this.p.height));
        this.previousPosition = this.position.copy();
        this.velocity = this.p.createVector();
        this.acceleration = this.p.createVector();
        this.force = this.p.createVector(0.5);
    }

    changeDirection(zOffset: number): void {
        const xOffset = (this.position.x * this.xyOffsetPerPixel) / this.noiseWidth;
        const yOffset = (this.position.y * this.xyOffsetPerPixel) / this.noiseWidth;
        const n = this.p.noise(xOffset, yOffset, zOffset);
        const angle = (n * this.p.TWO_PI * this.noiseWidth) % this.p.TWO_PI;
        this.p.stroke(angle, 1, n, 0.02);
        this.force.setHeading(angle);
        this.acceleration.add(this.force);
    }

    move(): void {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxVelocity);
        this.previousPosition.set(this.position);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
        if (this.edgeWrap) {
            this.wrapAroundEdges();
        }
    }

    /**
     * Wrap around the edges, meaning if a point leaves the canvas
     * on one side it reappears on the other.
     * Can be disabled by setting wrapAroundEdges to false.
     * This method can cause some artefacts at the edges
     * because the noise does not wrap around.
     */
    wrapAroundEdges(): void {
        if (this.position.x > this.p.width) {
            this.position.x -= this.p.width;
            this.previousPosition.x = this.position.x;
        } else if (this.position.x < 0) {
            this.position.x += this.p.width;
            this.previousPosition.x = this.position.x;
        }
        if (this.position.y > this.p.height) {
            this.position.y -= this.p.height;
            this.previousPosition.y = this.position.y;
        } else if (this.position.y < 0) {
            this.position.y += this.p.height;
            this.previousPosition.y = this.position.y;
        }
    }

    show(): void {
        this.p.line(this.previousPosition.x, this.previousPosition.y, this.position.x, this.position.y);
    }
}
