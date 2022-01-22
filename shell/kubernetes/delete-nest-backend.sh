# delete service and deployment of nest-backend
kubectl delete service nest-backend -n=$NAMESPACE
kubectl delete deployment nest-backend -n=$NAMESPACE