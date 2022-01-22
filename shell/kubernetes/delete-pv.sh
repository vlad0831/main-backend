# delete persistent volume
kubectl delete persistentvolumeclaims pg-pv-claim -n=$NAMESPACE
kubectl delete persistentvolume pg-pv-volume -n=$NAMESPACE
kubectl delete storageclasses fast -n=$NAMESPACE
kubectl delete sotrageclasses gp2 -n=$NAMESPACE