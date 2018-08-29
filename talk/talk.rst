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
    * There ought to be a better way here

----

:id: no-cors

:strike:`CORS`
==============

.. note::
    * We can do without CORS
    * No I'm not saying we need a big framework like django or ruby on rails

----

:id: what-if

What if...
==========

.. note::
    * What if there were a "middle man"
    * Something that behaved as though everything were on the same origin
    * What if everything was "proxied"

----

:id: reverse-proxy

Reverse Proxy
=============

|reverse_proxy_diagram|


.. note::
    * A proxy server that retrieves resources on behalf of a client
    * To the browser it's talking to localhost, when in fact its request
      is being forwarded by the reverse proxy to the docker container running
      the development server

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
        listen 9000;
        server_name localhost;

        location /api {
          # In development, setting a variable to proxy_pass allows nginx to
          # start with services down
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

:id: caveat-cra

Caveat
======

:strike:`create-react-app`

.. note::
    * Many people love create-react-app, and for good reason
    * Webpack support and webpack-serve support are coming; please contribute!
    * public url support is coming; please contribute!
    * Webpack 4 is simpler and greatly improved compared to previous versions;
      worth learning in any case

----

:id: tooling

Tooling
=======

|docker_logo|
|compose_logo|
|react_logo|
|webpack_logo|
|nginx_logo|

*Note*: These are all open-source tools developed by third parties

.. note::
    * I'm specifically using these tools because they're the simplest to me
    * It's likely that you can use different tools to achieve the same result
    * Needs:
        * Containers
        * A way of orchestrating said containers
        * A reverse proxy service
        * A front-end development server

----

:id: docker-and-compose

Docker and docker-compose
=========================

.. note::
    * Every service should have a Dockerfile describing
    * Consider using a multi-stage build to split development from production
    * If you push containers to a private/public registry, consider using
      those in docker-compose

----

:id: volumes

Volumes
=======

* Quick Updates
* Locally retain database files

.. note::
    * Docker volumes enable two things:
        * The updating of files without a full re-build of the container; this
          speeds up the feedback loop
        * Local database management; you can mount database files on your local
          file system, which enables you to retain database files after
          destroying and re-creating a database container
    * Might be more complex on Mac or Windows
    * A similar concept exists in tools like Kubernetes

----

:id: git-info

If you have issues or enhancements
==================================

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
