#!/bin/bash
#

docker build -t parsecr:carousel .

sleep 5

docker rm -f carousel_find

docker run --name carousel_find -d parsecr:carousel
