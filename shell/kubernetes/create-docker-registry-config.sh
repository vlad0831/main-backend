# create docker config
# comment this after the first setup
# change the file path as needed
kubectl create secret docker-registry regcred \
--docker-server=registry.gitlab.com \
--docker-username=$DOCKER_REGISTRY_USERNAME \
--docker-password=$DOCKER_REGISTRY_PASSWORD \
--docker-email=$DOCKER_REGISTRY_EMAIL -n=$NAMESPACE