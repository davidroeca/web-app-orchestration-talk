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
~~~~~~~~~~~
Senior Software Engineer
~~~~~~~~~~~~~~~~~~~~~~~~

Kepler Group
~~~~~~~~~~~~

----

:id: story

Real-World Example
==================

.. note::
    * You have source code for a web api and a web app
    * You don't want to use a monolithic framework and instead want to
      modularize source code of each api and app
    * Rite of passage

----

:id: story-api

API
===

|api_hello|

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
        fetch('http://localhost:3000/api/hello')
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
    * You write a react app that queries the API and displays the result

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
      the remote resource at http://localhost:3000/api/hello. (Reason: CORS
      header ‘Access-Control-Allow-Origin’ missing)."

----

:id: cors-sad

Man vs CORS
===========

|sad_man|

----

.. note::
    * Google will tell you a solution for how to install another dependency
      on the API to handle CORS, and then also enable cors in the fetch API
    * There ought to be a better way here

----

Main Takeaway From This Talk
============================

* You can run multiple apps and apis at the same time in development
* :strike:`CORS`

.. note::
    * Instead of going through the mind-numbing exercise of configuring CORS on
      the back-end and front-end, I'll highlight what I hope you'll be able
      to take away from today's talk:
    * It's possible to run multiple apps and apis at the same time in
      development, and to do so without having to configure CORS.
    * This development environment is just missing a key ingredient:
      - a "middle man"
      - Something that behaved as though everything were on the same origin

----

:id: reverse-proxy

Reverse Proxy
=============

|reverse_proxy_diagram|


.. note::
    * Definition: a proxy server that makes downstream requests to other
      servers and returns a response on behalf of the other servers
    * To the browser it's talking to localhost, when in fact its request
      is being forwarded by the reverse proxy to the docker container running
      the development server

----

:id: forward-proxy

Disambiguation
==============

|forward_proxy_diagram|

.. note::
    * In comparison to a "proxy" or "forward proxy" makes requests to
      servers on behalf of a client

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

.. code:: nginx

    http {
      server {
        listen 80;
        server_name localhost;

        location /api {
          # In development, setting a variable to proxy_pass
          # allows nginx to start with services down
          set $target "http://localhost:3000";
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
    * NGINX in this scenario is what the browser will interact with on port
      9000
    * NGINX forwards requests for both front-end assets and back-end queries
      to the respective applications and the browser treats it like one single
      application
    * Note that in the current use case, the frontend only handles requests
      made to `/app`. We need to handle this routing configuration.

----

:id: mount-app

Routing App: publicPath
=======================

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
    * By default, webpack-dev-server and webpack-serve route requests to /
    * In order to tell the reverse proxy where to forward requests, it makes
      sense to mount the app under a specific route
    * If all tools worked well, this would be all we needed

----

:id: html-template-1

Defining HTML Template
======================

.. code:: javascript

    // webpack.config.js
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const config {
      // ...
      plugins: [
        // ...
        new HtmlWebpackPlugin({
          'index.ejs',
          'index.html',
        })
      ],
      // ...
    };
    module.exports = config;

.. note::
    * In order to generate a dynamic html template with javascript injected,
    * html-webpack-plugin is what create-react-app uses under the hood

----

:id: html-template-2

Defining HTML Template
======================

Example index.ejs

.. code:: html

    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Example App</title>
      </head>
      <body>
        <div id='root'></div>
        <!--HtmlWebpackPlugin will inject bundle script
            path here -->
      </body>
    </html>

----

:id: dev-server-1

Configuring Webpack-Serve
=========================

.. code:: javascript

    // serve.config.js
    // ...
    const webpackConfig = require('./webpack.config');
    const publicPath = webpackConfig.output.publicPath;
    const config = {
      host: 0.0.0.0,
      port: 8080,
      devMiddleware: {
        publicPath,
      },
      // ...
    };
    module.exports = config;

.. note::
    * host 0.0.0.0 -> basically says try any IP address
    * port specified here should be consistent with nginx

----

:id: dev-server-2

Configuring Webpack-Serve
=========================

.. code:: javascript

    // serve.config.js
    // ...
    const path = require('path');
    const history = require('connect-history-api-fallback');
    const convert = require('koa-connect');
    const webpackConfig = require('./webpack.config');
    const publicPath = webpackConfig.output.publicPath;
    const config = {
      // ...
      add: (app, middleware, options) => {
        const historyOptions = {
          index: path.join(publicPath, 'index.html'),
        };
        app.use(convert(history(historyOptions)));
      },
    };
    module.exports = config;

.. note::
    * to mount app under another path, we need to add a history api fallback

----

:id: dev-server-3

Configuring Webpack-Serve
=========================

.. code:: javascript

    // serve.config.js
    // ...
    const webpackConfig = require('./webpack.config');
    const publicPath = webpackConfig.output.publicPath;
    const config = {
      // ...
      hotClient: {
        port: 34341,
        host: '0.0.0.0',
        allEntries: true,
        autoConfigure: true,
        reload: false,
        hmr: true,
      },
      // ...
    };
    module.exports = config;

.. note::
    * Configure a port for the hotClient that no other app will use
    * Same host configuration as the dev server itself
    * allEntries and autoConfigure add hot module replacement to compiler
    * Page is set not to reload but hot-module-replace -> useful for react
      hot component updates

----

:id: nginx-hot

NGINX Config for Hot reload
===========================

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

----

:id: might-be-done

You Might Be Done Here
======================

.. note::
    * A reverse proxy handles CORS issues, and running one will simplify
      application logic significantly.
    * For the remainder of this talk, I'll mention some specific tools that
      made my life easier, enabling me to work with many front-ends and
      back-ends

----

:id: tying-it-together

Tying it all together
=====================

|docker_logo|
|compose_logo|


.. note::
    * I will use docker and docker compose to simplify build and runs of each
      app
    * Also installs nginx
    * Handles database installation and management


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
    * Relies on docker which simplifies builds

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
        set $target "http://app:34341";
        proxy_pass $target;
      }
    }

    server {
      # ...
      location /api {
        set $target "http://api:3000";
        proxy_pass $target;
      }

      location /app {
        set $target "http://app:8080";
        proxy_pass $target;
      }
    }
  }

.. note::
    *

----

:id: demo

Demo
====

.. note::

    * Open terminal and run app

----

:id: caveat-cra

Caveats
=======

.. note::
    * Create-React-App
    * Webpack support and webpack-serve support are coming; please contribute!
    * public url support is coming; please contribute!
    * Webpack 4 is simpler and greatly improved compared to previous versions;
      worth learning in any case
    * Developed on linux; consider running in a virtual machine; might need
      alternative tools to the ones I've presented with

----

:id: git-info

The Source Code is Available
============================

https://github.com/davidroeca/web-app-orchestration-talk

.. note::
    * Send a PR or issue

----

:id: questions

Questions
=========

.. Images

.. |app_error| image:: images/app_error.png
    :height: 500px

.. |app_cors| image:: images/app_cors.png
    :height: 500px

.. |api_hello| image:: images/api_hello.png
    :height: 500px

.. https://pixabay.com/en/lonely-man-crying-alone-male-1510265/
.. |sad_man| image:: images/sad_man.jpg
    :height: 250px

.. |docker_logo| image:: downloads/images/dockerlogos/docker_logos_2018/PNG/vertical.png
    :height: 100px

.. |compose_logo| image:: downloads/images/compose_logo.png
    :height: 100px

.. |nginx_logo| image:: downloads/images/nginx_logo.svg
    :height: 100px

.. |webpack_logo| image:: downloads/images/webpack_logo.svg
    :height: 100px

.. |react_logo| image:: downloads/images/react_logo.svg
    :height: 100px

.. |reverse_proxy_diagram| image:: compiled/reverse_proxy.svg
    :height: 300px

.. |forward_proxy_diagram| image:: compiled/forward_proxy.svg
    :height: 300px
