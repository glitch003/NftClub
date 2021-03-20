#!/bin/zsh

yarn build && firebase deploy --except functions

