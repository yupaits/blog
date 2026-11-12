# CI 构建镜像：在 node:24-alpine 上预装 git 与 pnpm，
# 避免每次流水线重复执行 apk add git / npm i -g corepack / corepack 下载 pnpm。
# 由 CI 的「构建镜像」step 按本文件内容哈希构建；本地也可手动执行同一命令：
# docker build -f docker/ci/Dockerfile -t yupaits/blog-md-ci:node24 docker/ci
# 升级 pnpm 时需同步修改下方 ARG 与 package.json 的 packageManager 字段。
FROM node:24-alpine

ARG PNPM_VERSION=12.18.0
ARG NPM_REGISTRY=https://registry.npmmirror.com

# 只替换镜像源主机，保留镜像自带的 alpine 版本分支（3.23），避免跨版本混装
RUN sed -i 's#dl-cdn.alpinelinux.org#mirrors.ustc.edu.cn#' /etc/apk/repositories \
    && apk add --no-cache git

RUN npm install -g pnpm@${PNPM_VERSION} --registry=${NPM_REGISTRY} \
    && node -v && git --version && pnpm --version

ENV npm_config_registry=${NPM_REGISTRY} \
    COREPACK_NPM_REGISTRY=${NPM_REGISTRY}

WORKDIR /drone/src
