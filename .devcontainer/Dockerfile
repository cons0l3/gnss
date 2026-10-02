FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm

USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /workspaces/gnss \
    && chown -R node:node /workspaces/gnss

USER node
WORKDIR /workspaces/gnss
RUN curl -fsSL https://bun.sh/install | bash

ENV BUN_INSTALL="/home/node/.bun"
ENV PATH="$BUN_INSTALL/bin:$PATH"
