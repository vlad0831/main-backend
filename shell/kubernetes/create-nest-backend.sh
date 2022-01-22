# deploy nest-backend
sed -e "s|DOCKER_IMAGE_TAG|$DOCKER_IMAGE_TAG|g" kubernetes/nest-backend.yml | kubectl apply -n=$NAMESPACE -f  -