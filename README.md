## CoSense (working name) App

Design and run rapid sensemaking processes!

Check out [noflo-rsf](https://github.com/rapid-sensemaking-framework/noflo-rsf/blob/master/README.md#using-the-rsf-app) for screenshots of this app, and to understand the concept.

## Registration Page Server

Connects to a remote http server which will host registration pages for live links on the web for people to sign up with. Uses [rsf-http-register](https://github.com/rapid-sensemaking-framework/rsf-http-register)

Setup for connection with a participant register http server:

`.env` example:

```
REGISTER_HOST=127.0.0.1
REGISTER_PORT=3002
REGISTER_WS_PROTOCOL=ws
REGISTER_HTTP_PROTOCOL=http
```


## Noflo Runtime

Connects to a [rsf specific noflo runtime](https://github.com/rapid-sensemaking-framework/noflo-rapid-sensemaking-server) in order to execute a configured flow-based programming graph.

This repo can be extended to allow different noflo graphs representing various rsf type flows.

These flows can be designed and run on https://app.flowhub.io. Download the graph JSON files, and put them in this repo in the `graphs` folder. Then, create a JSON template for it and put in the `templates` folder.

Setup for connection with a rsf noflo server runtime:

`.env` example:

```
RUNTIME_ADDRESS=ws://127.0.0.1:3569
RUNTIME_SECRET=1lkj3134jn
```
If you're trying to connect to a server using `wss` and a self-signed certificate, make sure you also set:
```
NODE_TLS_REJECT_UNAUTHORIZED=0
```
or else it won't connect to the Noflo runtime.

## For development:

run

```
npm run tsbuild-electron
npm run tsbuild-react
npm start
```

While developing, if you make changes anywhere in `typescript/electron-only`, the electron server will auto-restart.

If you make changes in `src` to the UI, you will get live reload for development.

## To build for production:

```
npm run tsbuild-electron
npm run tsbuild-react
npm run build
```

To test this build, run

```
npm run electron
```

To package for MacOS, run

```
npm run package-mac
```

To package for Windows, run

```
npm run package-win
```

## Folders

- `src/*`
  - React code for the UI
- `typescript/*.js`
  - typescript code shared between the UI, and the electron code
- `typescript/electron-only/*.js`
  - typescript code just for running in the main electron process, not the UI
