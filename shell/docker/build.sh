# build docker image
docker build -t $DOCKER_IMAGE_TAG -f Dockerfile --target $DEPLOY_ENV .