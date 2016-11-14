#!/bin/bash
#

docker build -t test:m1_iphone_stock .

sleep 5

docker rm -f m1_iphone_stock

docker run --restart=always --name m1_iphone_stock -d test:m1_iphone_stock
