#!/bin/bash

export NODE_ENV=development

SERVICE_NAME=sur-price-me

LOG_PATH="/var/log/chrishic/$SERVICE_NAME"
LOG_FILENAME="$LOG_PATH/$SERVICE_NAME.log"

# If there is an existing log file, save it (by renaming)
if [ -f "$LOG_FILENAME" ]; then
    # Get the current date/time stamp
    d=$(date '+%y-%m-%d_%H-%M-%S')
    mv $LOG_FILENAME $LOG_PATH/$SERVICE_NAME_$d.log
fi

pushd ..

node index.js --name=$SERVICE_NAME >> $LOG_FILENAME 2>&1 &

popd
