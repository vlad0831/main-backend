# port-forward for localhost to access service in development
kubectl port-forward deployment/nest-backend 30050:3000 -n=$NAMESPACE