// TODO: Also visualize the frequencies.
// TODO: Add a volume slider?
//       Can I make the height of the waveform independent of the volume? Because when I lower the volume
//       the values also get lower. And if I scale it up again then there are steps because of low resolution.
//       Also remember that the volume is not linear, so 0.5 is not half as loud.
//       Can I control the volume of the browser tab without p5 so it has the full volume to analyze
//       but the actual output from the speakers is lower?

let audio;
let fft;
let half_height;

function preload() {
    audio = loadSound("assets/PERTURBATOR - Dangerous Days - 04 Future Club.mp3");
}

function setup() {
    createCanvas(800, 600);
    half_height = height / 2;
    // Audio may be too loud, so either adjust the volume in the browser or use this:
    outputVolume(0.1);
    fft = new p5.FFT();
    stroke(200);
    noFill();
}

function draw() {
    background(16);
    const wave = fft.waveform();
    beginShape();
    for (let x = 0; x < width; x++) {
        const i = int(map(x, 0, width, 0, wave.length));
        const y = wave[i] * half_height + half_height;
        vertex(x, y);
    }
    endShape();
}

function keyPressed() {
    if (key == " ") {
        if (audio.isPlaying()) {
            audio.pause();
            noLoop();
        } else {
            audio.play();
            loop();
        }
    }
}
