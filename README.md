# elma.build (WIP)

Create levels from templates. Templates are made of blocks and possible connections between them.

## How to run

1. Clone the repository locally.
2. Run `npm install` to install the dependencies.
3. Run `npm start` for local development.

### Technical notes and limitations

This is an electron project. It starts a main process that creates a desktop window, that window runs a renderer process that displays everyhing.

The main process is a node evironment and runs from the `main.ts` file. Whenever you change something there, you can write `rs` in the command line to quickly restart the project. 

The renderer process runs a React app from `renderer.ts`. To quickly see your changes you can press `ctrl + R`, hotreload is not really working. 

To communicate between the renderer and the main process it uses ipc communication located at `preload.ts`. Couldn't make `elmajs` dependency to run on the client side for this project, so to read a level file, the renderer uses ipc to have the main process read the level file and send back a level object (which doesn't include any functions, just values). 
