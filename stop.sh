#!/bin/bash

nums=$(ps aux | grep 'node ./ArrBot.js' | awk '{print $2}')


for num in $nums; do
	sudo kill -9 "$num" && echo "PID $num terminated..."
done