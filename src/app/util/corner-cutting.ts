import p5 from "p5";

/**
 * Cut the corners of an array of vertices using Chaikin's corner cutting algorithm.
 *
 * @param vertices the vertices to cut.
 * @param ratio the lerp amount between adjacent vertices. 0 - 0.5 produces rounded polygons.
 *     Other values have spiky effects.
 * @param iterations the number of iteratons. 3-4 should usually be enough for a nice rounded effect.
 *     Be careful not to set it too high because the number of vertices doubles each iteration.
 * @returns A new array of vertices.
 */
export function cutCorners(vertices: p5.Vector[], ratio: number, iterations: number): p5.Vector[] {
    let result = vertices.map((vector) => vector.copy());
    for (let i = 0; i < iterations; i++) {
        const newVertices = [];
        for (let j = 0; j < result.length; j++) {
            const a = result[j];
            const b = result[(j + 1) % result.length];
            newVertices.push(p5.Vector.lerp(a, b, ratio));
            newVertices.push(p5.Vector.lerp(b, a, ratio));
        }
        result = newVertices;
    }
    return result;
}
