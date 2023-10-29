# p5-Sketches

A collection of [p5.js](https://p5js.org/) sketches.

## Creating a new sketch

1. Update the dependency versions in *`template/package.json`*.
1. Copy the template directory and paste it with the name of the sketch.
1. Change the name in *`package.json`* to match the sketch.
1. Change the title in *`index.html`* to match the sketch.
1. Add or remove scripts from the *`index.html`*.
1. `cd` into the directory of the new sketch.
1. Run `npm install`.
1. Maybe create a *`README.md`* with info about the sketch.

## Running a sketch

I recomment using [live-server](https://www.npmjs.com/package/live-server) to view the sketches.
Install it globally and then run `live-server` inside the directory of the sketch.
An alternative is [http-server](https://www.npmjs.com/package/http-server) but that requires a hard refresh of the page every time the sketch is modified.

## Notes

**Q: What's the deal with the [@types/p5](https://www.npmjs.com/package/@types/p5) devDependency?**  
**A:** By linking to *`@types/p5/global.d.ts`* from the *`jsconfig.json`* it is possible to use autocompletion and view the documentation in Visual Studio Code.

## Resources

- <https://p5js.org>
- <https://www.npmjs.com/package/p5>
- <https://github.com/processing/p5.js/wiki/Positioning-your-canvas>
- [The issue where I got the solution for autocompletion from.](https://github.com/processing/p5.js/issues/1339)

## License

This project is licensed under the MIT license.
See [LICENSE.txt](LICENSE.txt) for details.
