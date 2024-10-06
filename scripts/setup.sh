#!/bin/bash

cd /software/jsonq.top/server

# check git installed
# if ! command -v git &> /dev/null
# then
#     echo "git not found, installing..."
#     if command -v yum &> /dev/null
#     then
#         sudo yum install -y git
#     else
#         echo "no supported package manager, please install git manually."
#         exit 1
#     fi
# fi

# # set git config
# git config --global user.name "JSQ"
# git config --global user.email "j996730508@163.com"

git pull origin server

npm install --production

npm run build

# check pm2 installed
if ! command -v pm2 &> /dev/null
then
    echo "pm2 not found, installing..."
    npm install -g pm2
fi


APP_NAME="nest-oss"

pm2 restart $APP_NAME  || pm2 start dist/src/main.js --name $APP_NAME
