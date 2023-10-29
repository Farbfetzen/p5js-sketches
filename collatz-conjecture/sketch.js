function setup() {
    createCanvas(600, 600);
    noLoop();
}

function draw() {
    background(30, 10, 70);
    const length = 5;
    const angle = 0.23;
    for (let i = 1; i < 10_000; i++) {
        let n = i;
        const sequence = [n];
        while (n > 1) {
            n = collatz(n);
            sequence.push(n);
        }
        sequence.reverse();

        resetMatrix();
        translate(width / 2, height / 2);
        stroke(random(100, 220), random(50, 250), random(180), 20);
        for (const element of sequence) {
            if (element % 2 === 0) {
                rotate(angle);
            } else {
                rotate(-angle);
            }
            line(0, 0, 0, -length);
            translate(0, -length);
        }
    }
}

function collatz(n) {
    if (n % 2 === 0) {
        return n / 2;
    }
    return n * 3 + 1;
}
