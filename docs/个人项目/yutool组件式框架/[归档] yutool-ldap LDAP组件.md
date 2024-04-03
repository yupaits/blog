# yutool-ldap LDAP组件

## 快速上手

### 1. Maven依赖

在项目的 `pom.xml` 中添加以下依赖：

```xml
<parent>
    <groupId>com.yupaits</groupId>
    <artifactId>yutool-parent</artifactId>
    <version>${yutool.version}</version>
    <relativePath/>
</parent>

<dependencies>
    <dependency>
        <groupId>com.yupaits</groupId>
        <artifactId>yutool-ldap</artifactId>
    </dependency>
</dependencies>
```

### 2. 配置文件

在项目的配置文件 `application.yml` 中添加以下配置：

```yaml
spring:
  ldap:
    urls: ldap://localhost:389
    username: cn=admin,dc=yupaits,dc=com
    password: password
    base: dc=yupaits,dc=com
```

### 3. 使用LdapExecutor操作LDAP数据

```java
@RestController
public class LdapController {

    private final LdapExecutor ldapExecutor;

    @Autowired
    public LdapController(LdapExecutor ldapExecutor) {
        this.ldapExecutor = ldapExecutor;
    }

    @GetMapping("/person/list")
    public List<LdapPerson> list() {
        return ldapExecutor.findAll();
    }

    @GetMapping("/person/{uid}")
    public LdapPerson getByUid(@PathVariable String uid) {
        return ldapExecutor.findByUid(uid);
    }

    @GetMapping("/person/auth")
    public boolean checkAuth(@RequestParam String uid, @RequestParam String password) {
        ldapExecutor.authenticate(uid, password);
        return true;
    }

    @GetMapping("/group/list")
    public List<LdapGroup> groupList() {
        return ldapExecutor.findAllGroups();
    }

    @GetMapping("/group/{groupName}")
    public LdapGroup getByName(@PathVariable String groupName) {
        return ldapExecutor.findGroupByName(groupName);
    }
}
```
