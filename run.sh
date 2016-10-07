#!/bin/bash
#

docker build -t node:parsecr .

sleep 5

docker rm -f parsecr

docker run --name parsecr -d node:parsecr
