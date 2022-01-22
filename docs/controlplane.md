# Control Plane

## [Install CLI](https://docs.controlplane.com/reference/cli#install-npm)

- globally install npm package
  ```sh
  pnpm i -g @controlplane/cli
  ```
- install auto complete
  ```sh
  cpln misc install-completion
  ```

## Configure CLI

- login control plane
  ```sh
  cpln login
  ```
- redirect to browser and continue with the authentication process

- update org and gvc info

  ```sh
  cpln profile update default --org allio --gvc main-gvc
  ```

- configure docker login credentials
  ```sh
  cpln image docker-login
  ```

## Push docker image

- push docker image follow this tag [convention](https://docs.controlplane.com/guides/push-image#step-4)
  ```sh
  docker push allio.registry.cpln.io/[IMAGE_NAME]:[TAG]
  ```
