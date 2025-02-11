#!/bin/sh

cd application
yarn workspaces focus --production --all
yarn start
