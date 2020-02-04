---
title: 系统架构探索
---

## 架构图

[系统架构](https://www.processon.com/diagraming/5d0aec8ee4b0d4ba353d4127)

## LB（负载均衡）

### 负载均衡选型 Nginx

## RPC 【待定，需参考实际使用场景】

### RPC框架选型 gPRC

gPRC适合服务间通信的场景，无需与前端应用进行交互，适用于当前的系统架构。

[gRPC文档](https://grpc.io/docs/)

## 服务治理

### ~~框架选型 etcd~~

- 服务发现

    1. 强一致性、高可用的服务存储目录。基于Raft算法的etcd本身就是一个强一致性高可用的服务存储目录。

    1. 注册服务和监控服务健康状态的机制。可以在etcd中注册服务，并且对注册的服务设置key TTL，定时保持服务的心跳以达到监控健康状态的效果。

    1. 查找和连接服务的机制。通过在etcd指定的主题下注册的服务也能在对应的主题下查找到。为了确保连接，我们可以在每个服务机器上都部署一个proxy模式的etcd，这样就可以确保能访问etcd集群的服务都能互相连接。

- 配置中心

    应用中用到的一些配置信息放到etcd上集中进行管理。应用在启动的时候主动从etcd获取一次配置信息，同时，在etcd节点上注册一个watcher并等待，以后每次配置有更新的时候，etcd都会实时通知订阅者，以此达到获取最新配置信息的目的。

- 分布式通知与协调

    1. 低耦合的心跳检测。检测系统和被检测系统通过etcd上某个目录关联而非直接关联起来，这样可以大大减少系统的耦合性。

    1. 系统调度。某系统有控制台和推送系统两部分组成，控制台的职责是控制推送系统进行相应的推送工作。管理人员在控制台做的一些操作，实际上是修改了etcd上某些目录节点的状态，而etcd就把这些变化通知给注册了watcher的推送系统客户端，推送系统作出相应的推送任务。

    1. 工作汇报。大部分类似的任务分发系统，子任务启动后，到etcd来注册一个临时工作目录，并且定时将自己的进度进行汇报（将进度写入到这个临时目录），这样任务管理者就能够实时知道任务进度。

- 分布式锁

    因为etcd使用Raft算法保持了数据的强一致性，某次操作存储到集群中的值必然是全局一致的，所以很容易实现分布式锁。有保持独占，控制时序两种使用方式。

    1. 保持独占，即所有获取锁的用户最终只有一个可以得到。etcd为此提供了一套实现分布式锁原子操作CAS（CompareAndSwap）的API。通过设置prevExist值，可以保证在多个节点同时去创建某个目录时，只有一个成功。而创建成功的用户就可以认为是获得了锁。

    1. 控制时序，即所有想要获得锁的用户都会被安排执行，但是获得锁的顺序也是全局唯一的，同时决定了执行顺序。etcd为此也提供了一套API（自动创建有序键），创建一个目录时指定为POST动作，这样etcd会自动在目录下生成一个当前最大的值为键，存储这个新的值（客户端编号）。同时还可以使用API按顺序列出所有当前目录下的键值。此时这些键的值就是客户端的时序，而这些键中存储的值可以是代表客户端的编号。

#### 集群搭建

Raft算法在做决策时需要多数节点的投票，所以etcd集群一般部署奇数（推荐3、5、7）个数节点。

- 集群启动

    etcd有三种集群化启动的配置方案，分别为静态配置启动、etcd自身服务发现、通过DNS进行服务发现。通过配置内容的不同，你可以对不同的方式进行选择。

    1. 静态配置

        这种方式比较适用于离线环境，在启动整个集群之前，你就已经预先清楚所要配置的集群大小，以及集群上各节点的地址和端口信息。那么启动时，你就可以通过配置initial-cluster参数进行etcd集群的启动。

        在每个etcd机器启动时，配置环境变量或者添加启动参数的方式如下。

        ```
        ETCD_INITIAL_CLUSTER="infra0=http://10.0.1.10:2380,infra1=http://10.0.1.11:2380,infra2=http://10.0.1.12:2380"
        ETCD_INITIAL_cluster_STATE=new
        ```

        参数方法：

        ```
        -initial-cluster infra0=http://10.0.1.10:2380,infra1=http://10.0.1.11:2380,infra2=http://10.0.1.12:2380 -initial-cluster-state new
        ```

        值得注意的是，`-initial-cluster` 参数中配置的url地址必须与各个节点启动时设置的 `initial-advertise-peer-urls` 参数相同。（`initial-advertise-peer-urls` 参数表示节点监听其他节点同步信号的地址）。

        如果你所在的网络环境配置了多个etcd集群，为了避免意外发生，最好使用 `-initial-cluster-token` 参数为每个集群单独配置一个token认证。这样就可以确保每个集群和集群的成员都拥有独特的ID。

        综上所述，如果你要配置包含3个etcd节点的集群，那么你在三个机器上的启动命令分别如下所示。

        ```
        $ etcd -name infra0 -initial-advertise-peer-urls http://10.0.1.10:2380 \
        -listen-peer-urls http://10.0.1.10:2380 \
        -initial-cluster-token etcd-cluster-1 \
        -initial-cluster infra0=http://10.0.1.10:2380,infra1=http://10.0.1.11:2380,infra2=http://10.0.1.12:2380 \
        -initial-cluster-state new

        $ etcd -name infra1 -initial-advertise-peer-urls http://10.0.1.11:2380 \
        -listen-peer-urls http://10.0.1.11:2380 \
        -initial-cluster-token etcd-cluster-1 \
        -initial-cluster infra0=http://10.0.1.10:2380,infra1=http://10.0.1.11:2380,infra2=http://10.0.1.12:2380 \
        -initial-cluster-state new

        $ etcd -name infra2 -initial-advertise-peer-urls http://10.0.1.12:2380 \
        -listen-peer-urls http://10.0.1.12:2380 \
        -initial-cluster-token etcd-cluster-1 \
        -initial-cluster infra0=http://10.0.1.10:2380,infra1=http://10.0.1.11:2380,infra2=http://10.0.1.12:2380 \
        -initial-cluster-state new
        ```

        在初始化完成后，etcd还提供动态增、删、改etcd集群节点的功能，这个需要用到etcdctl命令进行操作。

    1. etcd自发现模式

        通过自发现方式启动etcd集群需要事先准备一个etcd集群。如果你已经有一个etcd集群，首先你可以执行如下命令设定集群的大小，假设为3。

        ```
        $ curl -X PUT http://myetcd.local/v2/keys/discovery/6c007a14875d53d9bf0ef5a6fc0257c817f0fb83/_config/size -d value=3
        ```

        然后你要把这个url地址 `http://myetcd.local/v2/keys/discovery/6c007a14875d53d9bf0ef5a6fc0257c817f0fb83` 作为 `-discovery` 参数来启动etcd。节点会自动使用 `http://myetcd.local/v2/keys/discovery/6c007a14875d53d9bf0ef5a6fc0257c817f0fb83` 目录进行etcd的注册和发现服务。

        最终你在某个机器上启动etcd的命令如下。

        ```
        $ etcd -name infra0 -initial-advertise-peer-urls http://10.0.1.10:2380 \
        -listen-peer-urls http://10.0.1.10:2380 \
        -discovery http://myetcd.local/v2/keys/discovery/6c007a14875d53d9bf0ef5a6fc0257c817f0fb83
        ```

        如果你本地没有可用的etcd集群，etcd官网提供了一个可以公网访问的etcd存储地址。你可以通过如下命令得到etcd服务的目录，并把它作为 `-discovery` 参数使用。

        ```
        $ curl http://discovery.etcd.io/new?size=3
        http://discovery.etcd.io/3e86b59982e49066c5d813af1c2e2579cbf573de
        ```

        同样的，当你完成了集群的初始化后，这些信息就失去了作用。当你需要增加节点时，需要使用etcdctl来进行操作。

        为了安全，请务必每次启动新etcd集群式，都是用新的descovery token进行注册。另外，如果你初始化时启动的节点超过了指定的数量，多余的节点会自动转化为Proxy模式的etcd。

    1. DNS自发现模式

        etcd还支持使用DNS SRV记录进行启动。关于DNS SRV记录如何进行服务发现，可以参阅[RFC2782](http://tools.ietf.org/html/rfc2782)，所以，你要在DNS服务器上进行相应的配置。

        1. 开启DNS服务器上SRV记录查询，并添加相应的域名记录，使得查询到的结果类似如下。

            ```
            $ dig +noall +answer SRV _etcd-server._tcp.example.com
            _etcd-server._tcp.example.com. 300 IN   SRV 0 0 2380 infra0.example.com.
            _etcd-server._tcp.example.com. 300 IN   SRV 0 0 2380 infra1.example.com.
            _etcd-server._tcp.example.com. 300 IN   SRV 0 0 2380 infra2.example.com.
            ```
        1. 分别为各个域名配置相关的A记录指向etcd核心节点对应的机器IP。使得查询结果类似如下。

            ```
            $ dig +noall +answer infra0.example.com infra1.example.com infra2.example.com
            infra0.example.com. 300 IN  A   10.0.1.10
            infra1.example.com. 300 IN  A   10.0.1.11
            infra2.example.com. 300 IN  A   10.0.1.12
            ```

        做好了上述两步DNS的配置，就可以使用DNS启动etcd集群了。配置DNS解析的url参数为 `-discovery-srv`，其中某一个节点的启动命令如下。

        ```
        $ etcd -name infra0 \
        -discovery-srv example.com \
        -initial-advertise-peer-urls http://infra0.example.com:2380 \
        -initial-cluster-token etcd-cluster-1 \
        -initial-cluster-state new \
        -advertise-client-urls http://infra0.example.com:2379 \
        -listen-client-urls http://infra0.example.com:2379 \
        -listen-peer-urls http://infra0.example.com:2380
        ```

        当然，你也可以直接把节点的域名改成IP来启动。

- 运行时节点变更

    etcd集群启动完毕后，可以在运行的过程中对集群进行重构，包括核心节点的增加、删除、迁移、替换等。运行时重构使得etcd集群无须重启即可改变集群的配置，这也是新版etcd区别于旧版包含的新特性。

    只有当集群中多数节点正常的情况下，你才可以进行运行时的配置管理。因为配置更改的信息也会被etcd当成一个信息存储和同步，如果集群多数节点损坏，集群就失去了写入数据的能力。所以在配置etcd集群数量时，强烈推荐至少配置3个核心节点。

    1. 节点迁移、替换

        当节点所在的机器出现硬件故障，或者节点出现如数据目录损坏等问题，导致节点永久性的不可恢复时，就需要对节点进行迁移或者替换。当一个节点失效以后，必须尽快修复，因为etcd集群正常运行的必要条件时集群中多数节点都正常工作。

        迁移一个节点需要进行四步操作：

        - 暂停正在运行的节点程序进程
        - 把数据目录从现有机器拷贝到新机器
        - 使用api更新etcdd中对应节点指向机器的url记录更新为新机器的ip
        - 使用同样的配置项和数据目录，在新的机器上启动etcd。

    1. 节点增加

        增加节点可以让etcd的高可用性更强。例如，3个节点最多允许1个节点失效；5个节点时就可以允许有2个节点失效。同时增加节点还可以让etcd集群具有更好的读性能，因为etcd的节点都是实时同步的，每个节点上都存储了所有的信息，增加节点可以从整体上提升读的吞吐量。

        增加一个节点需要进行两步操作：

        - 在集群中添加这个节点的url记录，同时获得集群的信息
        - 使用获得的集群信息启动新etcd节点

    1. 节点移除

        有时不得不在提高etcd的写性能和增加集群高可用性上进行权衡。Leader节点在提交一个写记录时，会把这个消息同步到每个节点，当得到多数节点的同意反馈后，才会真正写入数据。所以节点越多，写入性能越差。在节点过多时，你可能需要移除一个或多个。

        移除节点只需要一部操作，就是把集群中这个节点的记录删除。然后对应机器上的该节点就会自动停止。

    1. 强制性重启集群

        当集群超过半数的节点都失效时，就需要通过手动的方式，强制性让某个节点以自己为Leader，利用原有数据启动一个新集群。

        此时需要进行两步操作：

        - 备份原有数据到新机器
        - 使用 `-force-new-cluster` 加备份的数据重新启动节点

        注意：强制性重启是一个迫不得已的选择，它会破坏一致性协议保证的安全性（如果操作时集群中尚有其它节点在正常工作，就会出错），所以在操作前请务必要保存好数据。

#### Proxy模式

etcd作为一个反向代理把客户的请求转发给可用的etcd集群。这样你就可以在每一台机器都部署一个Proxy模式的etcd作为本地服务，如果这些etcd Proxy都能正常运行，那么你的服务发现必然是稳定可靠的。

Proxy并不是直接加入到符合强一致性的etcd集群中，同样的，Proxy并没有增加集群的可靠性，也没有降低集群的写入性能。

- Proxy取代Standby模式的原因

    为什么要有Proxy模式而不是直接增加etcd核心节点呢？实际上etcd每增加一个核心节点（peer），都会增加Leader节点一定程度的包括网络、CPU和磁盘的负担，因为每次信息的变化都需要进行同步备份。增加etcd的核心节点可以让整个集群具有更高的可靠性，但是当数量达到一定程度以后，增加可靠性带来的好处就变得不那么明显，反倒是降低了集群写入同步的性能。因此，增加一个轻量级的Proxy模式etcd节点是对直接增加etcd核心节点的一个有效替代。

    Proxy模式实际上是取代了原先的Standby模式。Standby模式除了转发代理的功能以外，还会再核心节点因为故障导致数量不足的时候，从Standby模式转为正常节点模式。而当那个故障的节点恢复时，发现etcd的核心节点数量已经达到预先设置的值，就会转为Standby模式。

    但是在新版etcd中，只会在最初启动etcd的集群时，发现核心节点的数量已经满足要求时，自动启用Proxy模式，反之则并未实现。主要原因有：

    1. etcd是用来保证高可用的组件，因此它所需要的系统资源（包括内存、硬盘和CPU）都应该得到充分保障以保证高可用。任由集群的自动变换随意地改变核心节点，无法让机器保证性能。所以etcd官方鼓励在大型集群中为运行etcd准备专有机器集群。

    1. 因为etcd集群是支持高可用的，部分机器故障并不会导致功能失效。所以机器发生故障时，管理员有充分的时间对机器进行检查和修复。

    1. 自动转换使得etcd集群变得复杂，尤其是如今etcd支持多种网络环境的监听和交互。在不同网络间进行转换，更容易发生错误，导致集群不稳定。
    
    基于上述原因，目前Proxy模式有转发代理功能，而不会进行角色转换。

#### 数据存储

etcd的存储分为内存存储和持久化（硬盘）存储两部分，内存中的存储除了顺序化的记录下所有用户对节点数据变更的记录外，还会对用户数据进行索引、建堆等方便查询的操作。而持久化则使用预写式日志（WAL：Write Ahead Log）进行记录存储。

在WAL的体系中，所有的数据在提交之前都会进行日志记录。在etcd的持久化存储目录中，有两个子目录。一个WAL，存储着所有事务的变化记录；另一个式snapshot，用于存储某一个时刻etcd所有目录的数据。通过WAL和snapshot相结合的方式，etcd可以有效地进行数据存储和节点故障恢复等操作。

既然有了WAL实时存储了所有的变更，为什么还需要snapshot呢？随着使用量的增加，WAL存储的数据会暴增，为了防止磁盘很快就爆满，etcd默认每10000条记录做一次snapshot，经过snapshot以后的WAL文件就可以删除。而通过API可以查询的历史etcd操作默认为1000条。

首次启动时，etcd会把启动的配置信息存储到data-dir参数指定的数据目录中。配置信息包括本地节点的ID、集群ID和初始时集群信息。用户需要避免etcd从一个过期的数据目录中重新启动，因为使用过期的数据目录启动的节点会与集群中的其他节点产生不一致（如：之前已经记录并同意Leader节点存储某个信息，重启后又向Leader节点申请这个信息）。所以，为了最大化集群的安全性，一旦有任何数据损坏或丢失的可能性，你就应该把这个节点从集群中移除，然后加入一个不带数据目录的新节点。

- 预写式日志（WAL）

    WAL最大的作用是记录了整个数据变化的全部历程。在etcd中，所有数据的修改在提交前，都要先写入到WAL中。使用WAL进行数据的存储使得etcd拥有两个重要功能。

    - 故障快速恢复：当你的数据遭到破坏时，就可以通过执行所有WAL中记录的修改操作，快速从最原始的数据恢复到数据损坏前的状态。

    - 数据回滚（undo）/重做（redo）：因为所有的修改操作都被记录在WAL中，需要回滚或重做，只需要反向或正向执行日志中的操作即可。

#### 可视化

- [e3w](https://github.com/soyking/e3w)
- [CoreGI](https://github.com/yodlr/CoreGI)

### 注册中心ZooKeeper

[ZooKeeper文档](http://zookeeper.apache.org/)

### 配置中心Apollo

[Apollo文档](https://github.com/ctripcorp/apollo/wiki)

## 缓存

### 缓存更新策略

- 更新操作：

    1. 更新数据库；
    1. 删除本地缓存和分布式缓存。

- 查询操作：

    1. 查询本地缓存；
    1. 本地缓存命中，返回缓存数据；
    1. 本地缓存未命中，查询分布式缓存；
    1. 分布式缓存命中，更新本地缓存，返回缓存数据；
    1. 分布式缓存未命中，查询数据库，更新本地缓存和分布式缓存，返回数据。

### 缓存框架选型

- 分布式缓存：Redis

- 分布式缓存集群：~~Codis3.x + etcd~~ Redis Cluster

    ~~https://github.com/CodisLabs/codis~~

- Redis客户端：lettuce

- 本地缓存：Guava Cache

- Redis开发规范

### 应用集成

- 服务调用方需要传入是否缓存至本地缓存、是否缓存至分布式缓存参数，而不应该做缓存读取及更新操作；服务提供方按需整合缓存中间件。
- 缓存中间件需要处理缓存的读取及更新，设置并应用读取及更新策略，还需要支持缓存数据类型的自动适配。

## ORM框架

### ORM框架选型 Mybatis-Plus

Spring生态当前比较流行的ORM框架主要有JPA（默认实现使用hibernate）和Mybaits（推荐Mybatis-Plus框架）。针对实际开发时会有部分联表分页查询的情况，选择更为灵活的Mybatis-Plus作为ORM框架。

[Mybatis-Plus使用指南](https://mp.baomidou.com/guide/)

### 支持多租户方案

常见的支持多租户的方式有三种：

1. 每个租户有独立的物理数据库
1. 每个租户共享物理数据库，有独立的数据库（Schema，MySQL中Schema等同Database）
1. 每个租户共享数据库

这里根据实际情况选择第二种方式，每个租户独立的数据库（Schema）。

具体实现参考如下文档：

- ~~[动态数据源](https://mp.baomidou.com/guide/dynamic-datasource.html)~~
- ~~[动态参数解析数据源](https://gitee.com/baomidou/dynamic-datasource-spring-boot-starter/wikis/pages?sort_id=1030624&doc_id=147063)~~

- [动态表名SQL解析器](https://mp.baomidou.com/guide/dynamic-table-name-parser.html)

### sql语句审核

Mybatis对sql的灵活支持可能导致开发人员编写低质量的sql语句，因此需要增加sql语句审核流程。

## 数据库

### MySQL高可用方案 - MHA 【待定，考虑使用天翼云RDS】

使用MHA + Keepalived + MySQL主从复制方式实现MySQL高可用。

[MHA+Keepalived+MySQL主从](https://www.lmfe.org/2017/11/28/MHA+Keepalived+MySQL%E4%B8%BB%E4%BB%8E/)

### 读写分离

- 技术选型：[sharding-jdbc](https://shardingsphere.apache.org/document/current/cn/overview/) 【待定】

## 对象存储

### 分布式文件服务 fastdfs

- fasfdfs服务端

    [部署文档](https://github.com/happyfish100/fastdfs/wiki)

- fastdfs客户端

    使用tobato/FastDFS_Client，已集成到SpringBoot。

    [FastDFS-Client](https://github.com/tobato/FastDFS_Client)

## 认证鉴权

### 开放平台

- Spring Security OAuth2

### 客户管理系统

- Spring Security

### 企业平台管理

- ~~Spring Security LDAP~~ 【云服务器无法接入内网LDAP服务】

## 消息队列

### 消息队列技术选型 RabbitMQ

RabbitMQ可以比较容易地实现延时、重试队列，适用于当前地系统架构。而且Spring Boot Starter已经整合了AMQP（RabbitMQ是AMQP协议地实现），开发起来快捷方便。

### 集群搭建

- RabbitMQ Cluster

- Mirror queue policy

## 日志

### 日志方案 slf4j + log4j2 + ~~RabbitMQ~~ Kafka + ELK

- slf4j：日志门面
- log4j2：日志功能实现
- ~~RabbitMQ：日志队列异步传入logstash，性能更好，避免磁盘IO限制了日志地输出性能~~
- Kafka: 日志队列异步传入logstash，性能更好，避免磁盘IO限制了日志地输出性能
- ELK：日志收集存储展示

## 监控/预警

### 监控系统 Prometheus

### 监控可视化 Grafana

### 预警 Prometheus alertmanager

## 推送

### 手机客户端APP通知推送

~~[个推服务端Java快速入门](http://docs.getui.com/getui/server/java/start/)~~ 【待定，需要调研其他第三方推送平台】

### 网页消息推送

- WebSocket协议

    - 服务端：[Java-WebSocket](https://github.com/TooTallNate/Java-WebSocket/wiki)
    - 客户端：[sockjs-client](https://github.com/sockjs/sockjs-client) 或者 浏览器原生WebSocket

### 短信发送

- 使用当前已经接入的短信发送平台
- 短信回复统一处理

### 邮件发送

- spring-boot-starter-mail

## 工作流

### 工作流框架选型 Activiti 【待定，现阶段只需对当前工作流功能改进即可】

- activiti-spring-boot-starter-basic

## 任务调度

### 分布式任务调度框架 xxl-job

[xxl-job文档](http://www.xuxueli.com/xxl-job/#/)

### 集群搭建

[xxl-job调度中心集群](http://www.xuxueli.com/xxl-job/#/?id=%E6%AD%A5%E9%AA%A4%E4%B8%89%EF%BC%9A%E8%B0%83%E5%BA%A6%E4%B8%AD%E5%BF%83%E9%9B%86%E7%BE%A4%EF%BC%88%E5%8F%AF%E9%80%89%EF%BC%89%EF%BC%9A)

## 数据分析

- Metabase

- Redash

## 搜索 【待定，无使用场景】

### 搜索技术选型 Elasticsearch

- spring-boot-starter-data-elasticsearch

### Elasticsearch集群搭建

配置文件：

```
discovery.zen.ping.unicast.hosts: ["10.0.0.23","10.0.0.25"]
```

## 在线文档预览

- [kkFileView](https://github.com/kekingcn/kkFileView)

    [kkFileView文档](https://kkfileview.keking.cn/zh-cn/index.html)

## 参考文档

- [technology-talk 系统架构](https://github.com/aalansehaiyang/technology-talk#%E7%B3%BB%E7%BB%9F%E6%9E%B6%E6%9E%84)
- [系统设计入门](https://github.com/donnemartin/system-design-primer/blob/master/README-zh-Hans.md)
- [《后端架构师技术图谱》](https://github.com/xingshaocheng/architect-awesome)
- [从部落到帝国 - 后端技术栈的演进及开源实践](https://coderxing.gitbooks.io/architecture-evolution/content/)
- [从零开始搭建创业公司后台技术栈](http://www.phppan.com/2018/04/svr-stack/)
- [Mybatis Plus动态数据源](https://mp.baomidou.com/guide/dynamic-datasource.html)
- [谈谈怎么做服务隔离](https://zhuanlan.zhihu.com/p/59109781)
- [gRPC 官方文档中文版](http://doc.oschina.net/grpc)
- [MySQL高可用方案MHA的部署和原理](https://www.cnblogs.com/ivictor/p/5686275.html)
- [MHA+Keepalived+MySQL主从](https://www.lmfe.org/2017/11/28/MHA+Keepalived+MySQL%E4%B8%BB%E4%BB%8E/)
- [缓存的那些事](https://mp.weixin.qq.com/s/mcsyvqyu_re5EwoPpEY3Qw)
- [etcd：从应用场景到实现原理的全方位解读](https://www.infoq.cn/article/etcd-interpretation-application-scenario-implement-principle)
- [中通统一安全文件存储服务实践](https://www.secrss.com/articles/8139)
- [JIRA中的史诗、故事、版本与冲刺](https://zhuanlan.zhihu.com/p/33943882)