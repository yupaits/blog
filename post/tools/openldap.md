---
sidebar: auto
---
# 搭建OpenLDAP服务

> 引用自 [我花了一个五一终于搞懂了OpenLDAP](https://segmentfault.com/a/1190000014683418)

> 轻型目录访问协议（英文：Lightweight Directory Access Protocol，缩写：LDAP）是一个开放的，中立的，工业标准的应用协议，通过IP协议提供访问控制和维护分布式信息的目录信息。

大部分企业级工具都支持LDAP协议，我们可以搭建OpenLDAP服务使得这些企业级工具共享同一套用户名和密码来进行认证授权。

## 安装OpenLDAP

```bash
yum install openldap openldap-clients openldap-servers
```

启动OpenLDAP服务

```bash
service slapd start
```

## 配置OpenLDAP

### root.ldif

```
dn: olcDatabase={2}bdb,cn=config
changetype: modify
replace: olcRootDN
olcRootDN: cn=admin,dc=example,dc=com
-
replace: olcSuffix
olcSuffix: dc=example,dc=com
-
replace: olcRootPW
olcRootPW: {SSHA}RLFdZ/Ym/O9TODUMNAPh8a7F5DzDaG5P
```

修改RootDN，使用指令`ldapmodify -Q -Y EXTERNAL -H ldapi:/// -f root.ldif`

### org.ldif

```
dn: dc=example,dc=com
dc: example
objectClass: dcObject
objectClass: organizationalUnit
ou: rootobject

dn: ou=Group,dc=example,dc=com
ou: Group
description: Groups
objectClass: organizationalUnit

dn: ou=People,dc=example,dc=com
ou: People
description: People
objectClass: organizationalUnit
```

使用指令`ldapadd -H ldapi:/// -D "cn=admin,dc=example,dc=com" -x -w ${password} -f org.ldif`。注意将`${password}`替换为实际的密码。

以下三个文件以同样方式执行命令。

### memberof_config.ldif

```
dn: cn=module,cn=config
cn: module
objectClass: olcModuleList
olcModuleLoad: memberof
olcModulePath: /usr/lib64/openldap

dn: olcOverlay={0}memberof,olcDatabase={2}bdb,cn=config
objectClass: olcConfig
objectClass: olcMemberOf
objectClass: olcOverlayConfig
objectClass: top
olcOverlay: memberof
olcMemberOfDangling: ignore
olcMemberOfRefInt: TRUE
olcMemberOfGroupOC: groupOfNames
olcMemberOfMemberAD: member
olcMemberOfMemberOfAD: memberOf
```

### refint1.ldif

```
dn: cn=module{0},cn=config
add: olcmoduleload
olcmoduleload: refint
```

### refint2.ldif

```
dn: olcOverlay={1}refint,olcDatabase={2}bdb,cn=config
objectClass: olcConfig
objectClass: olcOverlayConfig
objectClass: olcRefintConfig
objectClass: top
olcOverlay: {1}refint
olcRefintAttribute: memberof member manager owner
```