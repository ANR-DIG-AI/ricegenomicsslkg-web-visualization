# WheatGenomicsSLKG Visualization Web Application

The [Wheat Genomics Scientific Literature KG](https://github.com/Wimmics/WheatGenomicsSLKG) (WheatGenomicsSLKG) is a FAIR knowledge graph that exploits
the Semantic Web technologies to integrate information about Named Entities (NE) extracted automatically from a corpus of
PubMed scientific articles on wheat genetics and genomics.

This repository is a React-based web application meant to search articles in WheatGenomicsSLKG, and provide a visualization of their metadata.
It uses the services offered by the [backend application](https://github.com/wimmics/d2kab-web-backend).

This project is part of the D2KAB

## Installation

Pre-requisite: [node.js](https://nodejs.org/) 17, yarn.

Install the dependencies with `yarn install`.

## Configuration

Configuration parameters are set in files .env.production and .env.development.
In particular, `REACT_APP_BACKEND_URL` must be set to the URL of the backend application.

## Run

Run the application in development mode: ` yarn start`.
By default the application listens on port 3001. This can be changed in file [.env](.env.development).
Make sure the application is properly started by pointing your browser to:
```
http://localhost:3001/search
```

Note for Windows users: you may need to authorize the execution of scripts on Powershell (as admin): `set-executionpolicy unrestricted`

To deploy the application, run `yarn build` and copy the build directory to the web server where you want to host the application.


### Logging

Log traces are printed out on the browser's console. It can be deactivated in file [.env](.env.development) by setting property:
```
REACT_APP_LOG = off
```

## License

See the [LICENSE file](LICENSE).
