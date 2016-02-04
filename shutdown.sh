#!/usr/bin/env bash

rm /tmp/cache.world

ps -ef | grep node | grep -v grep| cut -c 8-14 | xargs kill -9