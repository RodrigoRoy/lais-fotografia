#!/bin/bash

# Check if MongoDB is running
mongo --host 127.0.0.1:27017 --eval "db.stats()" > /dev/null
if [ $? -ne 0 ]; then
	echo "ERROR: MongoDB is not running"
	exit 1
fi

# Move to the main folder 'lais-fotografia'
cd ../..

# Start project
node server.js