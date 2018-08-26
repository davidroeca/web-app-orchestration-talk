:data-transition-duration: 0
:skip-help: true
:css: style.css
:title: React App Orchestration

----

:id: title-slide

Orchestrating React apps and back-ends in a development environment
===================================================================

David Roeca, Senior Software Engineer
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Kepler Group LLC
~~~~~~~~~~~~~~~~

----

:id: goals

Goals of this talk
==================

* Empower you (the developer) to think more about infrastructure
* This is possible - you'll be able to spot and reproduce bugs more quickly

.. note::
    * Think a level above the application
    * This is possible -- running a complete dev environment will help you spot
      bugs more quickly and with less risk

----

:id: caveat-web

Caveat
======

Web-Focused

.. note::
    * Some patterns here can be applied to mobile apps, but it would likely
      take additional work and special-casing based on the targeted platforms

----

:id: caveat-linux

Caveat
======

Developed on Linux

.. note::
    * I run Linux natively at home and at work; all of these examples were
      built and tested on Linux Mint 18 (based on Ubuntu Xenial)
    * Hopefully the concepts are laid out clearly enough that this can be
      translated to tools more suited to your development environment

----

:id: caveat-cra

Caveat
======

I'm not using Create-React-App

.. note::
    * Many people love create-react-app, and for good reason
    * Webpack support and webpack-serve support are coming; please contribute!
    * public url support is coming; please contribute!
    * Webpack 4 is simpler and greatly improved compared to previous versions;
      worth learning in any case

----

:id: assumption-containers

Assumption
==========

You run containers in production or will give them a shot

.. note::
    * Containers make deployments deterministic and replicable; they also make
      it easier to set up one's complete development environment

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

:id: typical-app

Typical React App
=================

.. note::

    * You have one or more back-end service(s) deployed and/or in development.
    * You want to build a react app that targets one or more back-ends.

----

:id: challenge-port

Challenge: localhost port listening
====================================

.. note::
    * I can't run any other apps locally on the same port
    * CORS
    * Conditional logic for allowed origins and how to query back-ends

----

:id: challenge-path

Challenge: url paths differ in production
=========================================

.. note::
    * Url paths are different
    * Conditional logic for resolved paths

----

:id: proposed-architecture

Proposed Architecture
=====================

.. note::
    * Diagram
    * Reverse Proxy Container
    * Back-End Container
    * Front-End Development Container

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

:id: reverse-proxy

Reverse Proxy
=============

What & Why?

.. note::
    * A proxy server that retrieves resources on behalf of a client
    * To the browser it's talking to localhost, when in fact its request
      is being forwarded by the reverse proxy to the docker container running
      the development server

----

:id: nginx

NGINX
=====

.. note::
    * A great, free reverse proxy program that can be easily configured.
    * We make use of variables to allow NGINX to start with some services down

----

:id: repo-structure

Mono or Submodules?
===================

.. note::
    * It's really up to you
    * Lots of experienced engineers reviweing PRs -> mono
    * Different levels of experience and contained ownership -> submodules
    * Lock down repo containing submodules and automate the submodule updates

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

.. |docker_logo| image:: images/dockerlogos/docker_logos_2018/PNG/vertical.png
    :height: 100px

.. |compose_logo| image:: images/compose_logo.png
    :height: 100px

.. |nginx_logo| image:: images/nginx_logo.svg
    :height: 100px

.. |webpack_logo| image:: images/webpack_logo.svg
    :height: 100px

.. |react_logo| image:: images/react_logo.svg
    :height: 100px
