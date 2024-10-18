[English](./README.md) | [中文](./README.zh-CN.md)

# Introduction

This is a simple OSS image hosting service based on NestJS.

# Features

- Request rate limiting
- Log output and recording
- Github OAuth2 login
- Dual token seamless refresh
- Quick file upload
- File type and size limitations
- Ability to recognize image URLs and upload them to OSS (works even faster with `auto-transfer-imgurl` project)
- Automatic server deployment with Github Actions

> The `.env` is an example, with local development prioritized the `.env.local`. On the server, you must manually upload the `.env.local` file.
