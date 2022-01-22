# delete service and deployment of postgres
kubectl delete service postgres -n=$NAMESPACE
kubectl delete deployment postgres -n=$NAMESPACE