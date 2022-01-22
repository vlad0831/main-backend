# create configmap from env file
kubectl create configmap allio-env \
--from-env-file=.env -n=$NAMESPACE