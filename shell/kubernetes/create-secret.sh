# create credentials
kubectl create secret generic allio-secrets \
--from-file=secrets -n=$NAMESPACE