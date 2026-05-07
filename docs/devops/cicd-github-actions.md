---
title: CI/CD 与 GitHub Actions
date: 2026-05-07
tags: ['CI/CD', 'GitHub Actions', '自动化']
readTime: '12 min'
---

# CI/CD 与 GitHub Actions

CI/CD 是现代软件开发的核心实践，GitHub Actions 提供了强大的自动化能力。

## 什么是 CI/CD

- **CI（持续集成）**：开发者频繁地将代码合并到主分支，每次合并都自动运行测试
- **CD（持续交付/部署）**：代码通过测试后自动部署到生产环境

## GitHub Actions 基础

### 工作流文件

工作流文件存放在 `.github/workflows/` 目录下：

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Build with Maven
      run: mvn clean package
    
    - name: Run tests
      run: mvn test
```

### 触发条件

```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 0 * * 0'  # 每周日执行
  workflow_dispatch:  # 手动触发
```

## 常用 Actions

### 缓存依赖

```yaml
- name: Cache Maven dependencies
  uses: actions/cache@v3
  with:
    path: ~/.m2
    key: ${{ runner.os }}-m2-${{ hashFiles('**/pom.xml') }}
```

### 构建 Docker 镜像

```yaml
- name: Build and push Docker image
  uses: docker/build-push-action@v4
  with:
    push: true
    tags: myapp:latest
```

### 部署到服务器

```yaml
- name: Deploy to server
  uses: appleboy/ssh-action@v0.1.5
  with:
    host: ${{ secrets.SERVER_HOST }}
    username: ${{ secrets.SERVER_USER }}
    key: ${{ secrets.SERVER_KEY }}
    script: |
      cd /opt/myapp
      docker-compose pull
      docker-compose up -d
```

## 完整示例：Spring Boot 应用 CI/CD

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'
    
    - name: Build with Maven
      run: mvn clean package -DskipTests
    
    - name: Run tests
      run: mvn test
    
    - name: Build Docker image
      run: |
        docker build -t myapp:${{ github.sha }} .
        docker tag myapp:${{ github.sha }} myapp:latest
    
    - name: Deploy to server
      if: github.ref == 'refs/heads/main'
      run: |
        echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
        docker push myapp:latest
        ssh ${{ secrets.SERVER_USER }}@${{ secrets.SERVER_HOST }} "cd /opt/myapp && docker-compose pull && docker-compose up -d"
```

## 环境变量和密钥

在 GitHub 仓库的 Settings > Secrets 中配置：

- `DOCKER_USERNAME`：Docker Hub 用户名
- `DOCKER_PASSWORD`：Docker Hub 密码
- `SERVER_HOST`：服务器地址
- `SERVER_USER`：服务器用户名
- `SERVER_KEY`：服务器 SSH 私钥

## 总结

GitHub Actions 是实现 CI/CD 的优秀工具，免费且易于使用。通过自动化构建、测试和部署，可以大大提高开发效率和代码质量。
