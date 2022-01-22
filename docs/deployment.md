# Deployment

## Summary

- use kubeadm to spin up a cluster on one AWS EC2 instance that has
  - at least 2 cpu cores
  - at least 2GB memory
- use attached AWS EBS to store PostgreSQL database pod
- use Calico for pod network

## Setup

### Create EC2 Instance

- launch a t3.small ubuntu 20.10 instance

### SSH into EC2

- download the private pem key pair that's attached to the EC2 instance
- change the pem permission on local
  ```sh
  chmod +x xx.pem
  ```
- note the public ip of the EC2 instance
- ssh into the EC2 instance
  ```sh
  ssh -i file/path/to/xx.pem ubuntu@public-ip
  ```

### Install Kubeadm and Docker

- run the following shell commands on EC2

  ```sh
  sudo apt update && sudo apt install -y apt-transport-https curl
  curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
  cat <<EOF | sudo tee /etc/apt/sources.list.d/kubernetes.list
    deb https://apt.kubernetes.io/ kubernetes-xenial main
  EOF
  sudo apt update

  sudo swapoff -a
  sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

  sudo apt install docker.io -y
  sudo usermod -aG docker ubuntu
  ```

- create `/etc/docker/daemon.json` on EC2 and add

  ```json
  {
    "exec-opts": ["native.cgroupdriver=systemd"]
  }
  ```

- run the following shell commands

  ```sh
  sudo systemctl daemon-reload
  sudo systemctl restart docker
  sudo systemctl enable docker.service

  sudo apt update && sudo apt install -y kubelet kubeadm kubectl
  sudo systemctl daemon-reload
  sudo systemctl start kubelet
  sudo systemctl enable kubelet.service
  ```

#### Reference

- https://medium.com/@dileepjallipalli/setting-up-a-single-master-kubernetes-cluster-on-aws-using-kubeadm-fad03e5937cf
- https://stackoverflow.com/a/68722458

### Enable iptables

- run the following shell commands on EC2
  ```sh
  echo "net.bridge.bridge-nf-call-iptables=1" | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
  ```

#### Reference

- https://www.howtoforge.com/setup-a-kubernetes-cluster-on-aws-ec2-instance-ubuntu-using-kubeadm/

### Initiate Kubeadm and Calico

- run the following shall commands on EC2

  ```sh
  sudo kubeadm init --pod-network-cidr=192.168.0.0/16

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

  kubectl create -f https://docs.projectcalico.org/manifests/tigera-operator.yaml
  kubectl create -f https://docs.projectcalico.org/manifests/custom-resources.yaml
  watch kubectl get pods -n calico-system
  # Wait until each pod has the STATUS of Running.
  kubectl taint nodes --all node-role.kubernetes.io/master-
  ```

#### Reference

- https://kubernetes.io/docs/concepts/cluster-administration/addons/
- https://docs.projectcalico.org/getting-started/kubernetes/quickstart

### Copy Files to EC2

- run the following sheell commands on EC2

  ```sh
  mkdir -p ~/app/shell/kubernetes
  mkdir -p ~/app/secrets
  mkdir -p ~/app/kubernetes
  ```

- run the following shell commands on local

  ```sh
  scp .env ubuntu@Allio-backend:/home/ubuntu/app/
  scp secrets/* ubuntu@Allio-backend:/home/ubuntu/app/secrets/
  scp cleanup.sh ubuntu@Allio-backend:/home/ubuntu/app/
  scp start.sh ubuntu@Allio-backend:/home/ubuntu/app/
  scp shell/kubernetes/* ubuntu@Allio-backend:/home/ubuntu/app/shell/kubernetes
  scp kubernetes/* ubuntu@Allio-backend:/home/ubuntu/app/kubernetes
  scp kubernetes/*/** ubuntu@Allio-backend:/home/ubuntu/app/kubernetes
  ```

- run the following shell commands on EC2

  ```sh
  chmod +x ~/app/shell/kubernetes/* ~/app/start.sh ~/app/cleanup.sh
  chmod 600 ~/app/secrets/* ~/app/.env ~/app/start.sh ~/app/cleanup.sh
  ```

- modify `~/app/.env`, `~/app/secrets/*`, `~/app/start.sh` and `~/app/cleanup.sh` accordingly, esp `DEPLOY_ENV=prod`

### Create Kubernetes Cluster

- run the start script on EC2
  ```sh
  cd ~/app/
  sh start.sh
  ```

### (Optional) Tear Down Kubeadm

- run the following shell commands on EC2
  ```sh
  sudo kubeadm reset
  ```
