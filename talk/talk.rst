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
    * To me, documentation is sort of a necessary evil, but one that we can
      minimize with a little bit of effort
    * It often gets out of date, and because of that I prefer to jump right
      into the source code.
    * Let me tell you a quick story to show you what I mean.

----

:id: story-1

Story Time
==========

.. note::
    * A few years ago, my company had interest in developing a new web
      application.
    * I was assigned to front-end which I would be writing in React, and my
      coworker was assigned to the backend, which he would be writing in python
    * In order to get up and running with the back-end, there was an extensive
      README and a couple of system dependencies to install
    * The README also pointed the reader to a series of files that needed to be
      used for bootstrapping the API

----

:id: story-2

Did you even check the README?
==============================

|zoolander_read|


.. note::
    * As the project moved forward, the requirements piled up.
    * At the same time, the python version I needed was a moving target--at one
      moment, it was python 3.4, and at the next moment there was a new feature
      used that required updates to 3.5 and later even 3.6
    * As the README evolved (or didn't, but should have), I needed to follow
      along to ensure the latest version of the API could run

----

:id: story-3

|programmer_two_states|

.. note::
    * I had my own extensive README that documented the nodejs dependencies
      setup process, which pointed people to the other README
    * On top of that, we relied very heavily on our staging environment prior
      to automating our tests, since we couldn't really trust our development
      environments much
    * Obviously, a staging environment still helps to check for any last-minute
      issues, but shouldn't be the only place you search for bugs


----

:id: story-4

|no_idea|

.. note::
    * The more people we onboarded, the more we realized that this approach
      simply does not scale to the number of possible environments,
      configurations, and project overlaps that might exist
    * Additionally, as more projects targeted our API, it became cumbersome to
      set up each development environment in its own unique way
    * We also had a bunch of application code across the stack that handled
      if/else on whether the environment was production/development, etc.
    * We needed better approach for setting up and managing our development
      environment

----

:id: throughline

Development Environment as Code
===============================

.. note::
    * Given that experience, among others, here is my outlook on the
      development environment
    * its setup should be minimal
    * That's not to say it can't be complicated; on the contrary, I'll show you
      a pretty complicated yet powerful setup
    * If I can boil down a complicated setup to a handful of commands, it will
      be a lot easier to on-board a new person
    * Applied on a larger scale, this philosophy can help replicate a local
      staging environment of sorts (how many people here have had to deploy
      code to debug something) - this solution can help get around some of
      these issues
    * This is typically achieved by moving the setup out of the readme and into
      configuration files
    * By the end of this talk, I hope you'll be able to start thinking
      about ways of updating your own development environment setup


----

:id: hypothetical-beginning

In the beginning...
===================

.. note::
    * So let's imagine we're first starting a project
    * Say I'm collaborating with my friend

----

:id: beginning-tech

React

|react_logo|


|express_logo|

.. note::
    * I'm writing a web app in React
    * She's working on a web api in Node and Express
    * I clone her code
    * I go through her README and install Node 8 and the necessary database
      requirements on my system

----

:id: run-api

Run the API
===========

.. code:: bash

    curl -X GET http://localhost:5000/api/hello

.. note::
    * I run the api and make my first request, awaiting the API's response
      with anticipation

----

:id: broken-api-1

API
===
.. code:: bash

    curl -X GET http://localhost:5000/api/hello
    500

.. note::
    * And the API breaks
    * Something's wrong, so I tell her

----

:id: works-on-my-machine

|works_on_my_machine|

.. note::
    * She tells me that it's working fine on her machine
    * Then we realize the issue

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
    * So I switch node versions

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
    * And it works as expected!
    * Now I could just move on and write my learnings down in a README...

----

:id: readme-workflow

README Workflow
===============

|readme_workflow|

.. note::
    * So let's see what all of us will be interacting with the README
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
      system-dependency parallel of running this command, and then writing
      about the javascript libraries in a README file
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
    * Shout out to yarn, for implementing the --save flag by default
    * It seems obvious that we write these dependencies to a config file.
    * So why should it be ok to write our system dependencies in the README?

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
    * One solution to this is something like Docker, a slightly more procedural
      package.json for system dependencies
    * Note: not the only solution
    * Could use a VM or something like kubernetes with minikube; the goal here
      is to have some lightweight abstraction that can be reliably replicated
      across systems
    * Docker to me is the simplest, which is part of why I chose it here

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
    * So we placed this API in captivity, and everyone is running Node 10 in
      docker. Now it's time to run the javascript app

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
    * And with the API running in Docker, nothing could go wrong!

----

:id: app-error

Running the App
===============

|app_error|

.. note::
    * Oh, looks like something's wrong
    * That's unclear, let's open the browser console

----

:id: app-cors

Running the App
===============

|app_cors|

.. note::
    * Looks like a CORS issue
    * Who here has ever encountered a CORS issue?

----

:id: cors-sad

Developer vs CORS
=================

|sad_man|

.. note::
    * This is truly a rite of passage for any web developer
    * Google will tell you a slew of solutions and how to change your frontend
      and backend code.
    * Unless you need to configure CORS in production as well, there's a better
      way here

----

:id: reverse-proxy

Reverse Proxy
=============

|reverse_proxy_diagram|

.. note::
    * We can use a reverse proxy
    * Definition: a proxy server that makes downstream requests to other
      servers and returns a response on behalf of the other servers
    * To the browser it's talking to localhost, when in fact its request
      is being forwarded by the reverse proxy to the development server

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
    * If you're just developing a single app, this is a partial CORS
      work-around supported by create-react-app
    * It's in the documentation, and I recommend checking this feature out
      if you've never used it. But it's not what I'm here to talk to you about
      today

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
    * Here's a setup you might consider (or be) using
    * You could mount different apps on different paths of the same origin
    * This is useful when thinking about logins, since you can use same-origin
      credentials for all APIs and apps
    * A reverse proxy in development can allow you to run both apps at the
      same time and have them link to one another, with the same logic you'd
      use in a production environment

----

:id: nginx

NGINX
=====

|nginx_logo|

.. note::
    * I'll be using NGINX in my demo today
    * It's a free reverse proxy application that can be easily configured.

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

Tying it all together:
======================

|compose_logo|

docker-compose
--------------

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
    * In addition to setting up the reverse proxy, you can also set up database
      dependencies locally, which can run as separate containers.
    * Similar to NGINX and the Node docker images, most popular database system
      developeres maintain their own respective docker images for public use

----

:id: how-to-run

How to Run
==========

.. code:: bash

    docker-compose build # build all containers
    docker-compose up # Run all services at once


.. note::
    * Once we've set up docker-compose, thiss is all we need to run


----

:id: why

Why do any of this?
===================

.. note::
    * Document less; code more--"Development Environment As Code". The goal
      here is to move it out of the README.
    * A system abstraction layer such as docker, coupled with docker-compose
      will help to pin down the system dependencies
    * Configuring a reverse proxy on development helps to remove unnecessary
      application logic for configuring CORS on development and will allow you
      to replicate the set-up you plan to deploy.

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

:id: git-info

The Source Code is Available
============================

github.com/davidroeca/web-app-orchestration-talk

.. note::
    * Send a PR or issue

----

:id: caveat-cra

Caveats
=======

.. note::
    * A couple of create-react-app issues still need solving before the
      hot-reloading setup can be used with this environment
    * Switching to webpack-serve and supporting public_url on development are
      the two main issues that need to be resolved
    * Docker itself is a system dependency (meta); no way to get around that,
      unfortunately

----

Thank You
=========

.. note::
    * Manon
    * 500 Tech
    * Digital Ocean

----

:id: questions

Questions
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

.. |express_logo| image:: downloads/images/express_logo.png
    :height: 100px

.. |zoolander_read| image:: downloads/images/zoolander_read.jpg
    :height: 400px

.. |programmer_two_states| image:: downloads/images/programmer_two_states.jpg
    :height: 400px

.. |no_idea| image:: downloads/images/no_idea.jpg
    :height: 400px

.. |reverse_proxy_diagram| image:: compiled/reverse_proxy.svg
    :height: 300px

.. |docker_workflow| image:: compiled/docker_workflow.svg
    :height: 500px

.. |readme_workflow| image:: compiled/readme_workflow.svg
    :height: 500px

.. |proxy_component| image:: compiled/proxy_component.svg
    :height: 400px
