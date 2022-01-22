# Kubernetes and Docker

## pre-requisite

- Install the following tools

  - Kubernetes
  - minikube
  - docker

- follow [`docker.md`](./docker.md#setup) to setup the docker registry credentials

## usage

- copy the start and cleanup scripts

  ```sh
  cp start.sh.example ./start.sh
  cp cleanup.sh.example ./cleanup.sh
  ```

- edit the start and cleanup script to modify the environmental variables inside the files accordingly. Docker registry related credentials can be obtained from the gitlab container registry settings.

- run `start.sh` in the project root folder to help start different resources in kubernetes

- use `cleanup.sh` in the project root folder to help delete different resources in kubernetes

- follow [this example](https://medium.com/@lukaszwolnik/nodejs-app-with-database-over-ssl-on-kubernetes-b0f0ad185e62)
