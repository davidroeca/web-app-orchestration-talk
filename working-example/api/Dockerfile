ARG USER_NAME=node
ARG USER_HOME=/home/node
ARG API_HOME=$USER_HOME/api

###########################################################
# Stage: Install dependencies
###########################################################
FROM node:10.9.0-alpine as base

ARG USER_HOME
ARG USER_NAME
ARG API_HOME

RUN apk add --no-cache yarn

RUN mkdir -p $API_HOME
COPY . $API_HOME

RUN chown -R $USER_NAME:$USER_NAME $API_HOME
USER $USER_NAME
WORKDIR $API_HOME

RUN yarn install

###########################################################
# Stage: Add additional development dependencies
###########################################################
FROM base as development

ARG USER_NAME

USER root

RUN apk add --no-cache bash

USER $USER_NAME

ENTRYPOINT ["yarn", "start"]

###########################################################
# Stage: Finalize production build
###########################################################
FROM base as release

ARG USER_NAME

USER $USER_NAME

ENTRYPOINT ["yarn", "start"]
