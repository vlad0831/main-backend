# Docker

## Setup

- [Install Docker](https://docs.docker.com/get-docker/)

- Setup docker credential helper to avoid saving password unencrypted

  - see this [guide](https://leimao.github.io/blog/Docker-Login-Encrypted-Credentials/) for reference
  - see and downlowd supported [docker credential helper](https://docs.docker.com/engine/reference/commandline/login/#credentials-store)
  - setup the credential store as the [guide](https://leimao.github.io/blog/Docker-Login-Encrypted-Credentials/) shows
  - [configure the credentials store](https://docs.docker.com/engine/reference/commandline/login/#credentials-store) in `$HOME/.docker/config.json`

- Setup personal access token in GitLab

  - Create personal access token with [this scope](https://docs.gitlab.com/ee/user/packages/container_registry/index.html#authenticate-with-the-container-registry)
  - copy the token to `~/my_password.txt` temporarily

- login to the GitLab container registry
  ```sh
  cat ~/my_password.txt| docker login registry.gitlab.com -u gitlab-ci-token --password-stdin
  ```

## Workflow

- Build a docker image

  - for Mac/Linux

    ```sh
    # run under project folder
    shell/docker/build.sh
    ```

- Push the docker image to GitLab Container Registry

  - for Mac/Linux

    ```sh
    shell/docker/push.sh
    ```

- Run a docker container

  - for Mac/Linux

    ```sh
    # run under project folder
    shell/docker/run.sh
    ```

- Develop over a docker container

  - for Mac/Linux

    ```sh
    # run under project folder
    shell/docker/run_dev.sh
    ```

- Remove a docker contianer

  - for Mac/Linux

    ```sh
    # run under project folder
    shell/docker/remove_container.sh
    ```
