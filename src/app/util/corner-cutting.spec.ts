import p5 from "p5";

import { cutCorners } from "src/app/util/corner-cutting";

describe("cutCorners", () => {
    const triangle = [new p5.Vector(0, 0), new p5.Vector(1, 0), new p5.Vector(0, 1)];

    it("should do nothing with empty array", () => {
        expect(cutCorners([], 0.5, 1)).toEqual([]);
    });

    [-1, 0].forEach((iterations) => {
        it(`should do nothing with ${iterations} iterations`, () => {
            expect(cutCorners(triangle, 1, iterations)).toEqual(triangle);
        });
    });

    [-0.25, 0, 0.33, 0.5, 0.75, 1, 1.33].forEach((ratio) => {
        it(`should work with a ratio of ${ratio}`, () => {
            const line = [new p5.Vector(0, 0), new p5.Vector(1, 1)];
            const a = new p5.Vector(ratio, ratio);
            const b = new p5.Vector(1 - ratio, 1 - ratio);
            expect(cutCorners(line, ratio, 1)).toEqual([a, b, b, a]);
        });
    });

    [
        {
            iterations: 1,
            expected: [
                new p5.Vector(0.25, 0),
                new p5.Vector(0.75, 0),
                new p5.Vector(0.75, 0.25),
                new p5.Vector(0.25, 0.75),
                new p5.Vector(0, 0.75),
                new p5.Vector(0, 0.25),
            ],
        },
        {
            iterations: 2,
            expected: [
                new p5.Vector(0.375, 0),
                new p5.Vector(0.625, 0),
                new p5.Vector(0.75, 0.0625),
                new p5.Vector(0.75, 0.1875),
                new p5.Vector(0.625, 0.375),
                new p5.Vector(0.375, 0.625),
                new p5.Vector(0.1875, 0.75),
                new p5.Vector(0.0625, 0.75),
                new p5.Vector(0, 0.625),
                new p5.Vector(0, 0.375),
                new p5.Vector(0.0625, 0.1875),
                new p5.Vector(0.1875, 0.0625),
            ],
        },
    ].forEach((params) => {
        it(`should work with ${params.iterations} iterations`, () => {
            expect(cutCorners(triangle, 0.25, params.iterations)).toEqual(params.expected);
        });
    });
});
