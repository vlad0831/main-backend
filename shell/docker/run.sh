# start container
docker run -d -v $(pwd)/.env:/usr/src/app/.env:ro -v $(pwd)/secrets/:/usr/src/app/secrets/:ro --name $DOCKER_CONTAINER_NAME -p 3000:3000 $DOCKER_IMAGE_TAG