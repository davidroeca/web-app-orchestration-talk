:data-transition-duration: 0
:skip-help: true
:css: style.css
:title: React App Orchestration

.. role:: strike
    :class: strike

----

:id: title-slide

Orchestrating React apps and back-ends in a development environment
===================================================================

David Roeca
-----------

Senior Software Engineer
~~~~~~~~~~~~~~~~~~~~~~~~

Kepler Group
~~~~~~~~~~~~

.. note::
    * Introduce self & work
    * So that's the title of my talk
    * I'll start with a show of hands: who here has a passion for writing
      documentation
    * <Make comment on show of hands>
    * I find that documentation often gets out of date, and I prefer to jump
      right into the source code.
    * Let me tell you a quick story to show you what I mean.

----

:id: story

Story Time
==========

.. note::
    * A few years ago, my company had interest in developing a new web
      application.
    * I began developing the front-end, and my coworker began developing the
      backend
    * After chatting with people and conducting my own research, I picked React
      since it seemed like an exciting new library with a lot of potential
    * My coworker picked Python/Flask to develop the back-end since we were and
      still are a bit of a Python shop
    * In order to get up and running with the back-end, there was an extensive
      README and a couple of system database dependencies to install
    * The README also pointed the reader to a series of files that needed to be
      used for bootstrapping the API
    * As the project moved forward, the requirements piled up.
    * At the same time, the python version used was a moving target--at one
      moment, it was python 3.4, and at the next moment there was a new feature
      used that required updates to 3.5 and later even 3.6
    * As the README evolved (or didn't, but should have), I needed to follow
      along to ensure the latest version of the API could run
    * Additionally, looking back fondly (or not so fondly) at this era, this
      was back in the days before we had anything remotely close to Create
      React App. I was on my own with the front-end setup, and had to configure
      everything webpack, to hot module replacement in the dev server
    * I had my own extensive README that documented the system dependencies
      and manual setup process
    * On top of that, we relied very heavily on our staging environment prior
      to automating our tests, since we couldn't really trust our development
      environments much
    * Obviously, a staging environment still helps to check for any last-minute
      issues, but shouldn't be the only place you search for bugs
    * The more people we onboarded, the more we realized that this approach
      simply does not scale to the number of possible environments,
      configurations, and project overlaps that might exist
    * Additionally, as more projects targeted our API, it became cumbersome to
      set up each development environment in its own unique way
    * We also had a bunch of application code across the stack that handled
      if/else on whether the environment was production/development, etc.
    * We needed better approach

----

:id: throughline

Development Environment as Code
===============================

.. note::
    * Given that experience, among others, this is the philosophy I like to
      follow, and I'll show you what I mean by that
    * In the world of DevOps, there is a popular buzzword called
      "Infrastructure as code"
    * That idea is basically to write code to manage your production
      infrastructure, so all changes along with the current setup are stored in
      version control and more readily evaluated
    * By the end of this talk, I hope you'll be able to start thinking about
      ways to apply this philosophy to your development environment setup as
      well
    * Why is it useful?
    * This setup should help make it easier to onboard someone
    * Instead of combing through a README (honestly, isn't that a funny name? A
      file that begs to be read), you can set it up with one or two commands.
    * A two-command setup can actually lead to a more powerful development
      environment because you can change the grow out the overall setup without
      changing the developer workflow.
    * And boiled down to one sentence, the idea is this: whenever possible,
      move your development setup to a config file
    * This might seem a bit daunting at first so let's break it down

----

:id: hypothetical-beginning

In the beginning...
===================

.. note::
    * So let's take a time machine back to when we're first starting a project
    * We'll encounter a few issues and then I'll go through how you might
      resolve them
    * In the beginning... there was darkness
    * Ok, we're not going back that far, but we'll go back to the start of the
      project
    * Let's say I'm collaborating with my friend
    * He's working on a web api, she picked NodeJS and Express, but this didn't
      really matter; she could have picked any HTTP framework in any language
    * I'm writing a web app
    * We want to modularize source code of each project and run them
      separately
    * I clone the source code
    * Run through her README and install Node 8 and the necessary database
      requirements on my system
    * I feel ready to make my first API request

----

:id: run-api

Run the API
===========

.. code:: bash

    curl -X GET http://localhost:5000/api/hello

.. note::
    * I start the api and make the simple request she documented in the README

----

:id: broken-api-1

API
===
.. code:: bash

    curl -X GET http://localhost:5000/api/hello
    500


|sad_man|

.. note::
    * And the API breaks
    * After running the API, I know something's wrong; it works on her system,
      but it doesn't work on mine
    * Bring her in to help
    * Then we spot the bug

----

:id: broken-api-2

API
===

.. code:: javascript

    router.get('/hello', (req, res) => {
      res.json({
        data: 'Hello, world!  '.trimEnd(), // BUG
      });
    });

.. note::
    * The bug is happining at the method call to trimEnd
    * Turns out that trimEnd is only supported in NodeJS 10 and above
    * You switch node versions, and start the API and it works!
    * I want you to keep this fix in mind as we continue with this talk, as
      Node versioning may not be the only issue that needs to fixed, which is
      often easily solved with node version managers such as nodenv, nvm, and n
    * What if my friend wrote her API in Go, ruby, rust, python, etc?
    * If all we care about is HTTP, then a slew of
      system requirements could cause problems in my development environment
    * What if I needed additional system dependencies such as a database
      system?
    * The limit does not exist
    * I'll get back to this in a bit, but first I want to highlight some other
      issues.

----

:id: story-api

API
===

.. code:: bash

    curl -X GET http://localhost:5000/api/hello
    {
      "data": "Hello, world!"
    }

.. note::
    * The API has one route at /api/hello, providing a simple message

----

:id: app-code

App Code
========

.. code:: javascript

    class App extends React.Component {

      state = {
        message: null,
        error: null,
      }

      fetchHello = () => {
        fetch('http://localhost:5000/api/hello')
          // ... handle promise chain and set state
      }

      componentDidMount() {
        this.fetchHello()
      }

      render() {
        // Display message if retrieved; show error if error
      }

    }

.. note::
    * App has some state to store message and errors
    * Has fetchHello method to fetch state
    * And when the component mounts, it calls the fetchHello method
      to display the result

----

:id: app-error

Running the App
===============

|app_error|

.. note::
    * You run the react app to see what happens

----

:id: app-cors

Running the App
===============

|app_cors|

.. note::
    * You get this CORS message
    * "Cross-Origin Request Blocked: The Same Origin Policy disallows reading
      the remote resource at http://localhost:5000/api/hello. (Reason: CORS
      header ‘Access-Control-Allow-Origin’ missing)."

----

:id: cors-sad

Man vs CORS
===========

|sad_man|

.. note::
    * Google will tell you a solution for how to install another dependency
      on the API to handle CORS, and then also enable cors in the fetch API
    * There ought to be a better way here

----

:id: proxy-idea

Proxy?
======

.. code:: javascript

    // package.json
    {
      // ...
      "proxy": {
        "/api": {
          "target": "http://localhost:5000"
        }
      },
      // ...
    }

.. note::
    * Instead of configuring CORS, I'll go over another possibility
    * create-react-app has a proxy feature that can simplify this
    * But what's actually going on?
    * Middle man
    * I think it would be helpful if we define some terms first

----

:id: reverse-proxy

Reverse Proxy
=============

|reverse_proxy_diagram|

.. note::
    * Definition: a proxy server that makes downstream requests to other
      servers and returns a response on behalf of the other servers
    * To the browser it's talking to localhost, when in fact its request
      is being forwarded by the reverse proxy to the development server

----

:id: forward-proxy

Disambiguation
==============

|forward_proxy_diagram|

.. note::
    * In comparison to a "proxy" or "forward proxy" makes requests to
      servers on behalf of a client

----

:id: why-useful

Using a Reverse Proxy
=====================


.. code:: text

    localhost/app1 -> React App 1
    localhost/app2 -> React (or non-react) App 2
    localhost/api -> Some back-end

.. note::
    * While the cra proxy config is quite useful, it has some limitations
    * One easy setup is to mount different apps on different paths
    * This is useful when thinking about logins, since you can use same-origin
      credentials
    * A reverse proxy in development can also allow you to run both apps at the
      same time and have them link to one another, without development-specific
      logic

----

:id: nginx

NGINX
=====

|nginx_logo|

.. note::
    * A great, free reverse proxy program that can be easily configured.

----

:id: nginx-config

NGINX Config
============

|nginx_logo|

.. code:: nginx

    http {
      server {
        listen 80;
        server_name localhost;

        location /api {
          # In development, setting a variable to proxy_pass
          # allows nginx to start with services down
          set $target "http://localhost:5000";
          proxy_pass $target;
        }

        location /app {
          set $target "http://localhost:8080";
          proxy_pass $target;
        }
      }
    }


.. note::
    * We make use of variables to allow NGINX to start with some services down
    * NGINX in this scenario is what the browser will interact with on port 80
    * NGINX forwards requests for both front-end assets and back-end queries
      to the respective applications and the browser treats it like one single
      application
    * Don't get too bogged down in details, source is online
    * Note that in the current use case, the frontend only handles requests
      made to `/app`. We need to handle this routing configuration.

----

:id: mount-app

Routing App: publicPath
=======================

|webpack_logo|

.. code:: javascript

    // webpack.config.js
    const config {
      // ...
      output: {
        // ...
        publicPath: '/app/',
      },
      // ...
    };
    module.exports = config;

.. note::
    * CRA doesn't support this in the development environment, so we'll have to
      define this configuration in webpack or cra rewire
    * They're working on it!
    * By default, webpack development servers route requests to the root
    * Since we want the app mounted under the app/ path, we need to configure
      publicPath

----

:id: dev-server-1

Configuring Webpack-Serve
=========================

|webpack_logo|

.. code:: javascript

    // serve.config.js
    // ...
    const webpackConfig = require('./webpack.config');
    const publicPath = webpackConfig.output.publicPath;
    const config = {
      host: '0.0.0.0',
      port: 8080,
      devMiddleware: {
        publicPath,
      },
      // ...
    };
    module.exports = config;

.. note::
    * webpack-serve is the future of webpack's development server
    * It will be incorporated into cra at some point
    * This configuration is needed to support alternative publicPaths
    * host 0.0.0.0 -> basically says try any IP address
    * port specified here should be consistent with reverse proxy config

----

:id: dev-server-2

Configuring Webpack-Serve
=========================

|webpack_logo|

.. code:: javascript

    // serve.config.js
    // ...
    const webpackConfig = require('./webpack.config');
    // ...
    const config = {
      // ...
      hotClient: {
        port: 34341,
        host: '0.0.0.0',
        // ...
      },
      // ...
    };
    module.exports = config;

.. note::
    * Configure a port for the hotClient that no other app will use
    * Same host configuration as the dev server itself
    * More configuration exists, such as historyApiFallback; source code is
      online

----

:id: nginx-hot

NGINX Config for Hot reload
===========================

|nginx_logo|

.. code:: nginx

    server {
      listen 34341;

      # Necessary configurations for the websocket server
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "Upgrade";

      location / {
        set $target "http://localhost:34341";
        proxy_pass $target;
      }
    }

.. note::
    * Some additional HTTP headers are needed
    * One annoying thing we need to do is ensure that the port lines up with
      the hotClient port
    * Again don't get too bogged in remembering these details, since the source
      code is online

----

:id: package-json

Wait a second...
================

.. note::
    * So I kind of just threw a lot at you...
    * This development environment is a bit complicated!
    * And let's think back to my node version conflict issues from the start.
    * We've just introduced a system dependency
    * A complicated one, at that
    * Setting up NGINX might throw people for a bit of a snag
    * And a different version of it might break up my set up
    * So I swear this next part is relevant, but I want to talk about
      package.json for a minute

----

:id: npm-install-bad-1

NPM Install
===========

.. code:: bash

    npm install <package-name>

.. note::
    * I'm developing a javascript app
    * Someone wants to install a package locally, so they type the following
      command
    * How do I feel?

----

:id: npm-install-bad-2

NPM Install
===========

.. code:: bash

    npm install <package-name>

|sad_man|

.. note::
    * When someone runs that command, this is how I feel
    * What's missing here?


----

:id: npm-install-better

NPM Install
===========

.. code:: bash

    npm install --save <dependency>
    npm install --save-dev <dev-dependency>

.. note::
    * We need to make sure the dependencies get added to package.json
    * Obvious, right? Without taking this step, we can't share our code with
      anyone else without an annoying README that might get out of date.
    * Yarn is a nice alternative that writes to package.json by default
    * package.json doesn't solve for node and npm versions -- you'll have to
      mention this in a README
    * What if we need a database?
    * What if we want to run our apps through a reverse proxy on development?

----

:id: docker

|docker_logo|

.. code:: Dockerfile

    # node has a pre-configured docker environment based on
    # node version

    FROM node:10.9.0-alpine as base

    # ...

    # Use system package manager to install yarn

    RUN apk add --no-cache yarn

    # ...

    RUN yarn install

    # ...

.. note::
    * In order to mitigate system dependency issues, I recommend using a
      system abstraction layer, such as Docker
    * Here, node has some pre-configured docker containers that can meet
      people's needs well
    * Plenty of people use docker containers in their production environment,
      but it's equally useful in development
    * Not the only solution
    * Could use a VM or something like kubernetes with minikube
    * Docker to me is the simplest

----

:id: tying-it-together

Tying it all together: docker-compose
=====================================

|compose_logo|

.. note::
    * Docker-compose can reference a number of these Dockerfiles and link
      them together in a unified way
    * It supports networking configuration to expose ports between different
      docker containers
    * Also installs nginx
    * Handles database installation and management
    * In theory if you have two back-ends that rely on two versions of a specific
      database system


----

:id: compose-file

Compose file
============

.. code:: yaml

    version: "3.6"
    services:
      nginx:
        restart: always
        build: ./nginx
        ports:
          - "80:80"
          - "34341:34341"
        # ...
      app:
        restart: always
        build:
          context: ./app
          target: development
        # ...
      api:
        # ...

.. note::
    * One file that defines how services interact
    * Think of it like package.json for your system dependencies

----

:id: updating-nginx-1

Updating NGINX
==============

.. code:: yaml

    version: "3.6"
    services:
      app:
        # Name is DNS
      api:
        # Name is DNS


.. code:: nginx

  http {

    # Resolve DNS via the docker dns server
    resolver 127.0.0.11;

    # ...

  }


.. note::
    * We can leverage docker's internal networking capabilities

----

:id: updating-nginx-2

Updating NGINX
==============

.. code:: nginx

  http {
    # ...
    server {
    # ...
      location / {
        # previously 'set $target "http://localhost:34341";
        set $target "http://app:34341";
        proxy_pass $target;
      }
    }

    server {
      # ...
      location /api {
        set $target "http://api:5000";
        proxy_pass $target;
      }

      location /app {
        set $target "http://app:8080";
        proxy_pass $target;
      }
    }
  }

.. note::
    * So we just need to change localhost to the relevant container DNS


----

:id: how-to-run

How to Run
==========

.. code:: bash

    docker-compose build # build all containers
    docker-compose up # Run all services at once


----

:id: caveat-cra

Caveats
=======

.. note::
    * CRA Webpack support and webpack-serve support are not here, but coming;
      please contribute!
    * CRA public url support is not here but coming; please contribute!
    * At some level you'll always need a system dependency or two--just try to
      limit the number to manually set up

----

:id: why

Why do any of this?
===================


.. note::
    * A reverse proxy will simplify any networking configuration you may need
      to do while developing apps. Create-react-app has a work-around, but it
      has its flaws if you want to link from one app to another app
    * It will be easier to on-board someone; OS-level abstractions will help
      pin down system dependencies and simplify set-up
    * Your application code will be simpler and won't have as many dev
      environment-specific logic for things such as CORS; you will have more
      power to configure your dev environment like you would with production.

----

:id: git-info

The Source Code is Available
============================

github.com/davidroeca/web-app-orchestration-talk

.. note::
    * I'll show you a demo in a bit - here's where my github repo lives, both
      for this talk and for the demo
    * Send a PR or issue

----

:id: demo

Demo
====

.. note::
    * It's a simple setup--two React apps, one bootstrapped with CRA, and one
      without it, as well as an API that interacts with a local database
    * Hot module replacement in the non-bootstrapped environment
    * CRA has limitation where you have to reload

----

:id: questions

Questions
=========

----

Thank You
=========

.. Images

.. |app_error| image:: images/app_error.png
    :height: 500px

.. |app_cors| image:: images/app_cors.png
    :height: 500px

.. https://pixabay.com/en/lonely-man-crying-alone-male-1510265/
.. |sad_man| image:: images/sad_man.jpg
    :height: 250px

.. |docker_logo| image:: downloads/images/dockerlogos/docker_logos_2018/PNG/vertical.png
    :height: 200px

.. |compose_logo| image:: downloads/images/compose_logo.png
    :height: 200px

.. |nginx_logo| image:: downloads/images/nginx_logo.svg
    :height: 200px

.. |webpack_logo| image:: downloads/images/webpack_logo.svg
    :height: 200px

.. |react_logo| image:: downloads/images/react_logo.svg
    :height: 100px

.. |reverse_proxy_diagram| image:: compiled/reverse_proxy.svg
    :height: 300px

.. |forward_proxy_diagram| image:: compiled/forward_proxy.svg
    :height: 300px
