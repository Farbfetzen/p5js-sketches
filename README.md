# p5-Sketches

A collection of [p5.js](https://p5js.org/) sketches.

## Creating a new sketch

1. Copy the *`sketches/template`* directory and paste it with the name of the new sketch.
1. Change the title in the new *`index.html`* to match the sketch.
1. Add or remove scripts from the new *`index.html`*.
1. Create a *`README.md`* with info about the sketch.
1. Add a link and a description to the list in the root *`index.html`*.

## Running a sketch

I recomment using [live-server](https://www.npmjs.com/package/live-server) to view the sketches.
Run `npm run serve` from the root of the project to start the server.
A browser window should automatically open.

An alternative is [http-server](https://www.npmjs.com/package/http-server) but that requires a hard refresh of the page every time a file is modified.

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
