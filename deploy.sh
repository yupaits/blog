#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

cd ./dist
git init
cp ../CNAME ./
git add .
git commit -m "构建并更新博客"
git push -f git@github.com:yupaits/blog.git master:gh-pages

cd -
