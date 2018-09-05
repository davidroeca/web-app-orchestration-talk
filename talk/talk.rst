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
    * My coworker picked Python/Flask to develop the back-end since we're a
      Python shop
    * In order to get up and running with the back-end, there was an extensive
      README and a couple of system dependencies to install
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
      everything from webpack and babel to hot module replacement in the dev
      server
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
      "Infrastructure as code"; it's popular for good reason, and has taken off
      in recent years
    * The idea is basically to write code to manage your production
      infrastructure, so all changes along with the current setup are stored in
      version control, readily evaluated, and easy to fix and update
    * The words on the screen highlight that this same idea can be applied to
      the development environment.
    * Why is this even useful?
    * This setup should help make it easier to onboard someone
    * Instead of combing through a README (honestly, isn't that a funny name? A
      file that begs to be read), you can set it up with one or two commands.
    * A two-command setup can actually lead to a more powerful development
      environment because you can grow out the overall setup without changing
      the developer workflow.
    * The code is self-documenting: you're moving the series of instructions to
      set up the dev environment from the README to code itself
    * And boiled down to one sentence, the idea is this: whenever possible,
      move your development setup to a configuration file
    * By the end of this talk, I hope you'll be able to start thinking
      about ways of updating your own development environment setup
    * This might seem a bit daunting at first so let's break it down

----

:id: hypothetical-beginning

In the beginning...
===================

.. note::
    * So let's imagine we're first starting a project
    * Let's say I'm collaborating with my friend
    * She's working on a web api, she picked NodeJS and Express, but this
      didn't really matter; she could have picked any HTTP framework in any
      language
    * I'm writing a web app
    * We want to modularize source code of each project and run them
      separately
    * I clone her source code
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




----

:id: works-on-my-machine

|works_on_my_machine|

.. note::
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

----

:id: fixed-api

API
===

.. code:: bash

    curl -X GET http://localhost:5000/api/hello
    {
      "data": "Hello, world!"
    }

.. note::
    * The API has one route at /api/hello, providing a simple message
    * However, to avoid this issue ever happening again, I propose using a
      system abstraction layer to get around this issue among others

----

:id: readme-workflow

README Workflow
===============

|readme_workflow|

.. note::
    * So let's just go through the workflow that was used to set up this
      environment.
    * Looks like a lot of manual steps!
    * There's a better way of doing things that I'll show you, but let's
      ground the discussion with a mention of package.json

----

:id: npm-install-bad-1

NPM Install
===========

.. code:: bash

    npm install <package-name>

.. note::
    * I'd say that the diagram I just showed you is kind of like the
      system-dependency parallel of running following command
    * Someone installed a package, but it wasn't written to package.json
    * The main issue here is a missing flag

----

:id: npm-install-better

NPM Install
===========

.. code:: bash

    npm install --save <dependency>
    npm install --save-dev <dev-dependency>

.. note::
    * We need to make sure the dependencies get added to package.json
    * Shout out to yarn, for implementing the --save flag by default
    * This should be something obvious to us, right? Without taking this step,
      we can't share our code with anyone else without an annoying README that
      might get out of date.
    * But yet this README approach is somehow the accepted practice when it
      comes to system dependencies in a development environment
    * So how do we replicate package.json for these system dependencies?

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
    * One solution is something like Docker
    * Docker is a lightweight virtualization layer that can help to pin down
      the necessary system dependencies in your app
    * Here, node has some pre-configured docker containers that can meet
      people's needs well
    * Plenty of people use docker containers in their production environment;
      it's a battle-tested solution.
    * I argue it's equally useful in development
    * Note: not the only solution
    * Could use a VM or something like kubernetes with minikube
    * Docker to me is the simplest
    * I'm not going to go too deep into dockerfiles here, but just know that by
      writing one, and by having docker installed, I can pin down the system
      dependencies in a fashion similar to package.json

----

:id: docker-workflow

Docker Workflow
===============

|docker_workflow|

.. note::
    * This is the modified diagram of the new workflow
    * Now, people can maintain the dockerfile, which is *code* rather than
      documentation used to spin up the development environment
    * A new developer runs one command and is ready to go.
    * So we placed this API in captivity, and it's running appropriately.
      Now it's time to run the javascript app

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
    * Has fetchHello method to fetch state from the API
    * And when the component mounts, it calls the fetchHello method
      to display the result
    * API is now running in docker -- my previous headaches were solved! Yeah!

----

:id: app-error

Running the App
===============

|app_error|

.. note::
    * You run the react app to see what happens
    * We went through this whole docker exercise and it's still broken

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
    * Who here has ever come across a CORS error?

----

:id: cors-sad

Developer vs CORS
=================

|sad_man|

.. note::
    * This is truly a rite of passage for any web developer
    * Google will tell you a solution for how to install another dependency
      on the API to handle CORS, and then also enable cors in the fetch API
    * Unless you need to configure CORS in production as well, there's a better
      way here

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
    * We can use a reverse proxy
    * This is configuration that works in create-react-app
    * It's a partial solution, and it might meet your needs if you have only
      one react app, but this solution isn't what I'm here to talk about

----

:id: reverse-proxy

Reverse Proxy
=============

|reverse_proxy_diagram|

.. note::
    * I want to set my own reverse proxy
    * Definition: a proxy server that makes downstream requests to other
      servers and returns a response on behalf of the other servers
    * To the browser it's talking to localhost, when in fact its request
      is being forwarded by the reverse proxy to the development server

----

:id: why-useful

Using a Reverse Proxy
=====================

.. code:: text

    localhost/app1 -> React App 1
    localhost/app2 -> React (or non-react) App 2
    localhost/api -> Some back-end

|proxy_component|

.. note::
    * One example setup is to mount different apps on different paths
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

.. |works_on_my_machine| image:: downloads/images/works_on_my_machine.jpg
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

.. |docker_workflow| image:: compiled/docker_workflow.svg
    :height: 500px

.. |readme_workflow| image:: compiled/readme_workflow.svg
    :height: 500px

.. |proxy_component| image:: compiled/proxy_component.svg
    :height: 400px
