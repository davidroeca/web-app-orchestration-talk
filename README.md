### Orchestrating React apps and back-ends in a development environment

This repository stores the example source code and presentation source code for
a presentation with the above title, to be given on `September 6, 2018` at the
React NYC Meetup.

### Description

This talk will highlight some patterns to help the development environment
mirror the production environment by using containers and a reverse proxy
image to manage local traffic on a single localhost port. In order to maintain
a usable and flexible development environment, this talk will also highlight
how to incorporate webpack 4, webpack-serve, and hot module replacement in this
environment.

### Presentation

The presentation is built with [hovercraft](https://github.com/regebro/hovercraft),
and relies on [plantuml](http://plantuml.com/) for diagrams.

### CORS Example

This example highlights the CORS issues found when working with traditional web
applications; configuring CORS may be the answer, if multiple origins are the
intended setup. Alternatively, `create-react-app` has a built-in proxy feature.

### Working Example

Prerequisites on Linux:
* Install Docker and docker-compose

```bash
docker --version
18.06.1-ce
docker-compose --version
1.22.0
```

Prerequisites on MacOS:
* Install [Docker for
  Mac](https://docs.docker.com/v17.12/docker-for-mac/install/)  (edge)

```
docker --version
Docker version 18.06.1-ce, build e68fc7a
docker-compose --version
docker-compose version 1.22.0, build f46880f
```

This example has been built and tested on a Linux Mint machine, as well as on
Mac OSX High Sierra. It's likely that this example should also work on Windows
with similar Docker and docker-compose versions.

This should provide a feasible hot-reloaded front-end development environment
under the `app/` directory.

#### Running the working-example

```bash
cd working-example
docker-compose build
docker-compose up
```

... in another shell session (you only have to do this the first time you build)

```bash
cd working-example

# Run a bash session within the api container
docker-compose exec api bash

# ... while in the container itself
./node_modules/.bin/sequelize db:migrate
# ... exit the container & bash session
```

With the database created, the app should be loadable in the browser at
`http://localhost/app`. Any changes made to the database should now be
persisted under `api_db/postgres/local_data`, which means that the containers
can be created and destroyed at will.

E.g.:

```bash
# Remove all containers & volumes
docker-compose rm -v
# ... say Y

# then create & run the containers again
docker-compose up
```

#### Clean up the example

If you want to clean up docker containers/images/volumes in one command, look
into `docker-compose down --help`.
