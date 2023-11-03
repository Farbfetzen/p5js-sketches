class Particle {
    position = createVector(random(width), random(height));
    previousPosition = this.position.copy();
    velocity = createVector();
    acceleration = createVector();
    maxVelocity = 4;
    force = createVector(0.5);

    update() {
        this.changeDirection();
        this.move();
    }

    changeDirection() {
        const xOffset = (this.position.x * xyOffsetPerPixel) / noiseWidth;
        const yOffset = (this.position.y * xyOffsetPerPixel) / noiseWidth;
        const n = noise(xOffset, yOffset, zOffset);
        const angle = (n * TWO_PI * noiseWidth) % TWO_PI;
        stroke(angle, 1, n, 0.02);
        this.force.setHeading(angle);
        this.acceleration.add(this.force);
    }

    move() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxVelocity);
        this.previousPosition.set(this.position);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
        if (wrapAroundEdges) {
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
    wrapAroundEdges() {
        if (this.position.x > width) {
            this.position.x -= width;
            this.previousPosition.x = this.position.x;
        } else if (this.position.x < 0) {
            this.position.x += width;
            this.previousPosition.x = this.position.x;
        }
        if (this.position.y > height) {
            this.position.y -= height;
            this.previousPosition.y = this.position.y;
        } else if (this.position.y < 0) {
            this.position.y += height;
            this.previousPosition.y = this.position.y;
        }
    }

    show() {
        line(this.previousPosition.x, this.previousPosition.y, this.position.x, this.position.y);
    }
}
