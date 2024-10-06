#!/bin/bash

# WORK_DIR="/software/jsonq.top/server"
# if [ ! -d "$WORK_DIR" ]; then
#   echo "Directory $WORK_DIR does not exist. Please check the path."
#   exit 1
# fi
# cd "$WORK_DIR"

# if ! command -v git &> /dev/null; then
#   echo "git not found, installing..."
#   if command -v yum &> /dev/null; then
#     sudo yum install -y git
#   else
#     echo "No supported package manager, please install git manually."
#     exit 1
#   fi
# fi

# git config --global user.name "JSQ"
# git config --global user.email "j996730508@163.com"

# git pull origin server

# if [ $? -ne 0 ]; then
#   echo "拉取失败，脚本终止"
#   exit 1
# fi &&
#     echo "pull success"

# if ! command -v node &> /dev/null; then
#   echo "node not found, please install Node.js manually."
#   exit 1
# fi

npm install --production

npm run build

# if ! command -v pm2 &> /dev/null; then
#   echo "pm2 not found, installing..."
#   npm install -g pm2
# fi

APP_NAME="nest-oss"

pm2 restart $APP_NAME || pm2 start dist/src/main.js --name $APP_NAME
