ARG USER_NAME=user
ARG USER_HOME=/home/$USER_NAME
ARG JAVA_DIR=$USER_HOME/java
ARG PATH_PLANTUML=$JAVA_DIR/plantuml.jar
ARG PROJECT_HOME=$USER_HOME/talk

FROM python:3.7-alpine as base

ARG USER_NAME
ARG USER_HOME
ARG JAVA_DIR
ARG PATH_PLANTUML
ARG PROJECT_HOME
ARG PATH_COMPILED
ARG PATH_DOWNLOADS

RUN mkdir -p \
      $PROJECT_HOME \
      $JAVA_DIR \
      $PROJECT_HOME/compiled \
      $PROJECT_HOME/downloads/images \
      $PROJECT_HOME/downloads/fonts

RUN apk add --no-cache \
      # plantuml stuff
      openjdk8 \
      graphviz \
      ttf-droid \
      ttf-droid-nonlatin \
      # Hovercraft stuff
      gcc \
      libxml2-dev \
      libxslt-dev \
      libc-dev \
      # For downloads
      curl \
      # For Makefile
      make \
      # Better shell experience
      bash

COPY requirements.txt $PROJECT_HOME

RUN pip install -r $PROJECT_HOME/requirements.txt

RUN curl -L \
      http://sourceforge.net/projects/plantuml/files/plantuml.1.2018.10.jar/download \
      -o $PATH_PLANTUML

RUN addgroup -S $USER_NAME && adduser -S -G $USER_NAME $USER_NAME

RUN chown -R $USER_NAME:$USER_NAME $USER_HOME

USER $USER_NAME

COPY . $PROJECT_HOME

WORKDIR $PROJECT_HOME

EXPOSE 8000

CMD ["make"]
