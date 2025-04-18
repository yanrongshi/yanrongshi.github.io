# Kubean 集群生命周期管理


## 01背景
随着云原生理念的不断发展，越来越多的企业开始将业务部署至 Kubernetes 云平台，大量业务上云为企业带来敏捷与高效的同时，也为企业的运维管理带来了大量新的挑战。如何在兼容不同操作系统部署集群、如何实现跨区域的部署集群、如何实现在等保、信创等场景下在线（离线）部署集群等问题都为企业的应用上云带来了极大的挑战。面对企业业务需求的新变化，传统的基于二进制包部署 Kubernetes 集群存在诸多缺陷和不足。一方面手动部署 Kubernetes 集群涉及的技术栈门类多、门槛高，部署流程繁琐且重复，易于出错。另一方面通过手动部署集群在集群高可用、离线部署、插件预装等方面都存在诸多不足。为了降低 Kubernetes 的使用门槛，方便运维人员快速部署集群，Kubernetes 社区孵化出了一批如 Kubeadm、Kubespray、Kops 等用于快速部署集群的项目。

### 社区主流集群生命周期管理工具
**Kubeadm**：Kubernetes 官方推荐的集群部署工具，通过使用 init 建立控制节点和 join 来纳管工作节点的模式来构建集群，但是存在诸多小问题，无法满足企业生产环境所需要的稳定性和安全性需求。

**Kops**：一款用于生产级别的 Kubernetes 集群部署工具，与 AWS、Google、VMware 等国外云厂商耦合度高，需要结合国外云厂商的能力来实现集群的部署，缺乏灵活性。此外由于 Kops 的众多依赖源需要国外网络环境支持，所以其不适合国内企业使用。

**Kubespray**：一款用于生产级别的 Kubernetes 集群部署工具，集成了 Kubeadm 和 Ansible 自动化运维工具，兼容大部分基于 systemd 的操作系统且能够屏蔽底层计算环境的差异，使集群能够部署在物理机、虚拟机、边缘节点、云主机等各种计算环境之上。相较于其它工具，Kubespray 的可扩展性、灵活性更强，很大程度上降低了运维人员的负担，但部署过程中容易出错，对运维人员的使用门槛依旧很高。

### Kubean 应运而生
在以上述背景下，「Daocloud 道客」基于大量客户真实生产实践上的经验积累和社区技术方案的整合，在今年 6 月份开源了一款生产级的集群生命周期管理（创建、更新、删除）工具——Kubean。Kubean 采用 Kubespray 作为底层技术依赖，一方面简化了集群部署的操作流程，降低了用户的使用门槛。另一方面在 Kubespray 能力基础上增加了集群操作记录、离线版本记录等诸多新特性。Kubean 还提供了界面化创建集群的能力（需要结合社区版 DCE 5.0 容器管理功能），让新手用户也能一键创建和管理集群。本文主要对 Kubean 的主要功能进行介绍，关于社区版 DCE 5.0 的获取，可查阅 https://www.daocloud.io/dce_5.0_ce。

## 02 Kubean 主要功能
集群在线/离线部署Kubean 支持在线、离线两种集群部署方式，满足用户在内网/离线环境下快速部署集群。在离线模式下，最快半小时内就可自动完成一套生产高可用集群的部署。 集群快速扩缩容Kubean 支持对集群进行快速扩缩容操作，能够批量实现节点的增加和删除。并且在集群扩缩容期间，运行在其上面的业务应用不受任何影响。集群版本快速升级Kubean 支持对集群的 Kubernetes版本进行连续升级，在集群版本升级期间，运行在其上面的业务应用依旧不受任何影响。集群故障快速定位Kubean 会对集群部署、版本升级、扩缩容等操作保存详细的日志，当集群发生未知故障导致集群不可用时，通过详细的集群操作日志，用户能快速定位集群故障点。

## 03 Kubean 主要特性
简单易用用户可以使用 Helm 包在当前集群对 Kubean 进行快速安装，安装了 Kubean 的集群即能够获得部署、升级、扩缩容新集群的能力。当前 Kubean 支持的 Kubernetes 版本为 v1.20 至 v1.25，容器运行时为 Docker、Containerd、runc 等主流容器运行时。此外 Kubean 还支持对 Cilium、Calico、Multus 、 Cephfs、Local-path-provisioner 等诸多网络和存储插件进行预装，实现集群部署即生产就绪。生产级高可用在部署集群时，支持部署 3 个及以上 master 节点来实现集群的高可用，用户可以根据自身资源和业务重要性来决定高可用方案，进一步保障关键业务能够持续稳定的对外提供服务，降低系统性风险。屏蔽底层基础计算环境差异通过使用 Kubean，用户能够快速基于本地物理机、裸金属、虚拟机、云主机、边缘节点等计算环境部署 Kubernetes 集群，并实现对新建集群的全生命周期进行管理。兼容众多操作系统Kubean 支持麒麟、Centos 等国内外主流操作系统。具体操作系统如下：

- Debian Bullseye, Buster, Jessie, Stretch
- Ubuntu16.04, 18.04, 20.04, 22.04
- CentOS/RHEL 7,8, 9
- Fedora 35, 36
- Fedora CoreOS
- openSUSE Leap 15.x/Tumbleweed
- Oracle Linux 7,8, 9
- Alma Linux 8, 9
- Rocky Linux 8, 9
- Kylin Linux Advanced Server V10
- Amazon Linux 2

## 04 使用在线模式部署集群
本文将以 Kubean 社区的官方为例，演示如何使用 Kubean 快速在线部署集群，离线部署集群的方式请查阅https://github.com/kubean-io/kubean/blob/main/doc/offline.zh.md。在使用 Kubean 部署集群前，您需要预先在您的集群上安装 Kubean。使用 Helm 安装 Kubean首先，将 Kubean 图表存储库添加到您的本地存储库。

```bash
$ helm repo add kubean-io https://kubean-io.github.io/kubean-helm-chart/
```

接下来您可以查看 repo 是否已添加在本次存储库。

```bash
$ helm repo list
NAME            URL
kubean-io       https://kubean-io.github.io/kubean-helm-chart/
```

您可以运行以下命令来安装 Kubean。
```bash
$ helm install kubean kubean-io/kubean --create-namespace -n kubean-system
```

查看 Kubean 状态。

```bash
$ helm status kubean -n kubean-system

NAME: kubean
LAST DEPLOYED: Sat Oct 22 19:02:46 2022
NAMESPACE: kubean-system
STATUS: deployed
REVISION: 6
TEST SUITE: None
NOTES:
Thank you for installing kubean.

Chart Information:
    Chart Name: kubean
    Chart Description: A Helm chart for kubean

Release Information:
    Release Name: kubean
    Release Namespace: kubean-system

To learn more about the release, try:

  $ helm status kubean -n kubean-system
  $ helm get all kubean -n kubean-system

Documention: https://github.com/kubean-io/kubean/blob/main/README.md
```

### 前提条件
参照上文使用 Helm 安装 Kubean。
准备两个或两个以上的节点，并且保证节点和当前集群间的网络联通性。
如果在非 root 用户账户下运行，请预先在目标节点中为用户提升权限。

### 操作步骤
1. 前往 Github 拉取 Kubean 项目。
```bash
$ git clone https://github.com/kubean-io/kubean.git
```

2. 拉取到本地后，执行如下命令进入 kubean/artifacts/demo 文件夹

```bash
$ cd kubean/artifacts/demo
```

3. 执行如下命令修改 hosts-conf-cm.yml 中的 IP 地址为您本地或远程真实存在的节点 IP 地址并保存。
```bash
$ vi hosts-conf-cm.yml
#输出如下
apiVersion: v1
kind: ConfigMap
metadata:
  name: cluster1-demo-hosts-conf
  namespace: kubean-system
data:
  hosts.yml: |
    all:
      hosts:
        node1:
          ip: IP1 #更改为您本地或远端节点的 IP 地址
          access_ip: IP1 #更改为您本地或远端节点的 IP 地址
          ansible_host: IP1 #更改为您本地或远端节点的 IP 地址
          ansible_connection: ssh
          ansible_user: who  #远端节点登录的用户名，默认为 root
          ansible_ssh_pass: xxx #远端节点登录的密码
        node2:
          ip: IP2 #更改为您本地或远端节点的 IP 地址
          access_ip: IP2 #更改为您本地或远端节点的 IP 地址
          ansible_host: IP2 #更改为您本地或远端节点的 IP 地址
          ansible_connection: ssh #更改为您本地或远端节点的 IP 地址
          ansible_user: who #远端节点登录的用户名，默认为 root
          ansible_ssh_pass: xxx #远端节点登录的密码
      children:
        kube_control_plane:
          hosts:
            node1:
        kube_node:
          hosts:
            node1:
            node2:
        etcd:
          hosts:
            node1:
        k8s_cluster:
          children:
            kube_control_plane:
            kube_node:
        calico_rr:
          hosts: {}
```

4. 在当前安装了 Kubean 的集群上执行如下命令，开始部署新集群
```bash
$ kubectl apply -f demo
```

5. 至此，您便在当前集群开启了一个创建集群的任务，执行如下命令，查看这个任务。

```bash
$ kubectl get job -n kubean-system

```
6. 等待任务执行完成，完成集群的创建。


## 05 总结
本文简单介绍了 Kubean 的部分基础能力，还有更多新玩法等待着大家去发现，可以前往 Kubean 官方社区进一步探索和使用，我们也将之后的系列文章中，进一步带您深入了解 Kubean 这个项目背后的技术原理。



Kubean 官方社区：https://github.com/kubean-io/kubean

