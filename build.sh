#!/usr/bin/env sh
set -eu

npm ci
npm --prefix frontend ci
npm --prefix frontend run build
