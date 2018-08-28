ARG USER_NAME=node
ARG USER_HOME=/home/$USER_NAME
ARG APP_HOME=$USER_HOME/app

###########################################################
# Stage: Install dependencies
###########################################################
FROM node:10.9.0-alpine as base

ARG USER_HOME
ARG USER_NAME
ARG APP_HOME

RUN apk add --no-cache yarn

RUN mkdir -p $APP_HOME
COPY . $APP_HOME

RUN chown -R $USER_NAME:$USER_NAME $APP_HOME
USER $USER_NAME
WORKDIR $APP_HOME

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

ENTRYPOINT ["yarn", "build"]
