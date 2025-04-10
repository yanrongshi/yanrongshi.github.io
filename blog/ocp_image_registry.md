---
title: "OCP 镜像仓库/身份权限控制调研"
date: 2021-10-05
---

# OCP 镜像仓库/身份权限控制调研
> 调研版本：ocp 4.6.47

## 概述
Openshift Container Platfrom（以下简称OCP）是 Red Hat 的容器应用管理平台，本调研重点关注 OCP 的身份角色绑定和镜像仓库设计。其中，为了更好的让大家的了解 OCP 的架构，增加了对于镜像构建，应用生命周期管理，项目和命名空间相关概念的阐释。

## 相关概念的阐释
### 2.1、ImageStream（镜像流）
ImageStream 是 OCP对于镜像信息进行记录的特有抽象概念，可以通过它统一访问存放在不同Image Registry 的镜像。通俗的说 ImageStream 就是一个集合了不同镜像仓库的虚拟视图记录表。一个 ImageStream 由 ImageStreamTag（镜像流标签）和 ImageStreamImage（镜像指向信息） 共同构成。
![（图一）ImageStream 内部构成](/blog/img/ocp_ImageStream_%20composition.png)

当您定义引用镜像流标签的对象时，例如构建或部署配置，您指向的是镜像流标签而不是存储库。当您构建或部署应用程序时，OCP 使用镜像流标签查询存储库以定位镜像的关联 ID 并使用该镜像。图像流元数据与其他集群信息一起存储在 etcd 实例中。
![（图二）ImageStream yaml 详细内容](/blog/img/ocp_ImageStream_yaml.jpeg)
 
### 2.2、应用部署使用 ImageStream 的过程
首先通过 ImageStreamTag 在 ImageStream中找到对应的 ImageStreamImage，然后使用 ImageStreamImage 从远程 Registry 上 pull image，这样就可以使用该 Image 部署应用。
![（三）应用部署使用 ImageStream 的过程](/blog/img/ocp_ImageStream_benefits.png)

**使用图像流的好处（官方文档）：**

 - 您可以标记、回滚标记并快速处理镜像，而无需使用命令行重新推送。
 - 您可以在将新镜像推送到镜像仓库时触发构建和部署。此外，OCP 具有针对其他资源（例如 Kubernetes 对象）的通用触发器。
 - 您可以将 Tag 标记为定期重新导入。如果源镜像已更改，则该更改将被拾取并反映在镜像流中，这会触发构建或部署流程，具体取决于构建或部署配置。
 - 您可以使用细粒度访问控制共享镜像，并在您的团队中快速分发镜像。
 - 如果源镜像发生变化，镜像流标签仍指向该镜像的已知良好版本，确保您的应用程序不会意外中断。
 - 您可以通过imagestream对象的权限围绕谁可以查看和使用图像来配置安全性。
 - 没有权限在集群级别读取或列出镜像的用户仍然可以使用镜像流检索项目中标记的镜像。

### 2.3、Image 镜像仓库
OCP 支持使用 OCP 内置的镜像仓库和外部私有镜像仓库以及 S2I（从源代码到镜像）进行应用部署。本文重点关注 OCP  内置镜像仓库的调研和使用。

#### 2.3.1. OCP内置镜像仓库
OCP 的 内置镜像仓库包括项目名为 openshift 的系统默认自带的镜像仓库项目以及用户不同项目下的镜像仓库项目。

OCP默认自的 openshift 项目内的镜像可实现全局全租户进行查看，并且 Kubeadmin（系统管理员）可以新上传镜像至默认的 openshift 镜像仓库项目，以供全局用户使用。

在 OCP 镜像仓库体制中，一个项目/命名空间下带有一个与之相对应的 内置仓库项目，也就是说 OCP的每一个租户都有一个对应的内置仓库与之一一对应，并且可以通过 Service accounts（服务账号，以下简称为SA）进行跨项目使用镜像仓库。

#### 2.3.2回答几个问题：
1、OCP 可以实现跨NS调用吗？
答：可以，通过 SA 账户 绑定不同项目的 system:image-puller 角色。

2、普通用户可以推送镜像到 OCP 默认的 openshift 镜像仓库项目吗？
答：默认是不可以，但是通过对 imagestreamimports 资源进行角色绑定，并赋予至特定的用户身上，即可实现。

3、从外部推送的镜像会存储在项目内部的镜像仓库吗？
答：默认不储存。具体看镜像推送的方式，1、如果使用 podman push 进行推送会将外部 Image 传到内部镜像仓库中并保存。2、如果使用 oc import-image 命令只是根据外部镜像的元数据生成ImageStream对象，ImageSteam还是指向外部镜像。但如果在 oc import-image 命令后添加 “ --reference-policy='local' ” 参数，可实现 podman push 同样的效果。

#### 2.3.3. OCP 使用外部私有仓库
OCP 支持使用外部镜像仓库拉取镜像，在拉取外部私有镜像时，需要创建拉取密匙，并且绑定到服务账户。官方文档上的几种创建姿势：
![OCP 使用外部私有仓库](/blog/img/ocp_third_party_image_registry.png)

### 2.4、 OCP身份认证体系
OCP 以插件形式支持多种 identity provider，比如在测试环境中常用的 htpasswd，生产环境中常用的 LDAP 等。这些 provider 中会保存用户身份信息，比如用户名和密码。useridentitymapping 对象将 user 对象和 identity 对象联系在一起。
OCP 包含一个内置的 OAuth 服务器。用户获取 OAuth 访问令牌以对 API 进行身份验证。当一个人请求一个新的 OAuth 令牌时，OAuth 服务器使用配置的身份提供者来确定发出请求的人的身份。
然后确定该身份映射到哪个用户，为该用户创建访问令牌，并返回令牌以供使用。

### 2.5、 OCP RBAC角色控制
- 对于 OpenShift 集群资源，比如 pod，deployment，route 等，通过 role （角色）进行控制。

从范围（scope）上分，role 可分为集群角色（clusterRole）和项目角色（role）。每个角色定义了受控制的对象（subject）、允许的操作（verb）和范围（集群还是项目）。用户（user）和角色（role/clusterRole）之间通过 rolebinding/clusterrolebinding 对象进行绑定。

- 对于操作系统资源，这只针对服务账户。宿主机上的用户访问宿主机上的资源，这由宿主机操作系统进行控制。pod 中的用户（serviceaccount）访问pod内和宿主机上操作系统资源，由 **scc**（security context constraints）进行控制。
- **RBAC角色绑定的两个级别**

| RBAC级别     |                             描述                             |
| ------------ | :----------------------------------------------------------: |
| Cluster RBAC | 适用于所有项目的角色和绑定。集群角色存在于集群范围内，且集群角色绑定创建时只能引用集群角色。 |
| Local RBAC   | 限定在给定项目范围内的角色和绑定。虽然本地角色只存在于单个项目中，但本地角色绑定创建时可以同时引用集群和本地角色 |

> 项目用户如果想查看集群视图，必须将集群角色view与项目用户绑定的本地角色进行绑定。
>
> 这种两级层次结构允许通过集群角色跨多个项目重用，同时允许通过本地角色在单个项目内部进行定制。
> 
OCP包含一组默认集群角色，可以绑定到集群或者项目本地范围。


|   默认集群角色   | 描述                                                         |
| :--------------: | ------------------------------------------------------------ |
|      admin       | 一个项目管理员。如果在本地绑定中使用，`admin`则有权查看项目中的任何资源并修改项目中除配额外的任何资源 |
|    basic-user    | 可以获取有关项目和用户的基本信息的用户                       |
|  cluster-admin   | 可以在任何项目中执行任何操作的超级用户。当绑定到具有本地绑定的用户时，他们可以完全控制配额以及项目中每个资源的每个操作。 |
|  cluster-status  | 可以获取基本集群状态信息的用户                               |
|       edit       | 可以修改项目中大多数对象但无权查看或修改角色或绑定的用户。   |
| self-provisioner | 可以创建自己的项目的用户                                     |
|       view       | 无法进行任何修改但可以查看项目中的大多数对象的用户。他们无法查看或修改角色或绑定 |

集群角色、本地角色、集群角色绑定、本地角色绑定、用户、组和服务帐户之间的关系如下图所示
![角色控制](/blog/img/ocp_account.png)

### 2.6、角色相关常用命令
#### 2.6.1、角色绑定
赋予用户集群中所有项目特定的权限（集群级别）

```bash
oc adm policy add-cluster-role-to-user <role> <username>
```
- `<role>`角色名，如admin
- `<username>` 用户名，如用户A


删除用户集群中所有项目特定的权限（集群级别）

```bash
oc adm policy remove-cluster-role-from-user <role> <username>
```
赋予用户项目中特定的权限（项目级别）

```bash
oc adm policy add-role-to-user <role> <username> -n <namespace>
```
删除用户项目中特定的权限（项目级别）

```bash
oc adm policy remove-role-from-user <role> <username>
```
#### 2.6.2、创建角色
 创建本地角色
 

```bash
oc create role <name> --verb=<verb> --resource=<resource> -n <project>
```
- `<name>`, 本地角色的名称
- `<verb>`, 以逗号分隔的要应用于角色的动词列表。常见有： `get`，`list`，`create`，`update`，`delete`，- `deletecollection`，或`watch`
- `<resource>`，角色适用的资源
- `<project>`, 项目名称

#### 2.6.3、跨命名空间调用镜像仓库
使用内部 registry 时，为了允许项目A引用项目B中的镜像，项目A必须将服务帐户绑定到项目B中的system:image-puller角色。
代码如下：

```bash
oc policy add-role-to-user \
    system:image-puller system:serviceaccount:项目A:default \
    --namespace=项目B
   ```

> 本文部分内容来源于Openshift Container Olatfrom 官方文档，链接地址：https://docs.openshift.com/container-platform/4.6/welcome/index.html
