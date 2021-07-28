---
title: ORM框架gorm使用手册
date: 2020-02-04 09:41:37
category: Golang
tags: 
  - Golang
  - ORM
  - gorm
---

> 项目地址：[https://github.com/jinzhu/gorm](https://github.com/jinzhu/gorm)

> [gorm文档](https://jasperxu.github.io/gorm-zh/)

## GORM 中文文档

[http://gorm.book.jasperxu.com/](http://gorm.book.jasperxu.com/)

Golang写的，开发人员友好的ORM库。
### 概述
* 全功能ORM（几乎）
* 关联（包含一个，包含多个，属于，多对多，多种包含）
* Callbacks（创建/保存/更新/删除/查找之前/之后）
* 预加载（急加载）
* 事务
* 复合主键
* SQL Builder
* 自动迁移
* 日志
* 可扩展，编写基于GORM回调的插件
* 每个功能都有测试
* 开发人员友好

### 安装

```
go get -u github.com/jinzhu/gorm
```
### 升级到V1.0
* [更新日志](https://github.com/jasperxu/gorm-zh/blob/master/changelog.md)

### 快速开始
```go
package main

import (
    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/sqlite"
)

type Product struct {
  gorm.Model
  Code string
  Price uint
}

func main() {
  db, err := gorm.Open("sqlite3", "test.db")
  if err != nil {
    panic("连接数据库失败")
  }
  defer db.Close()

  // 自动迁移模式
  db.AutoMigrate(&Product{})

  // 创建
  db.Create(&Product{Code: "L1212", Price: 1000})

  // 读取
  var product Product
  db.First(&product, 1) // 查询id为1的product
  db.First(&product, "code = ?", "L1212") // 查询code为l1212的product

  // 更新 - 更新product的price为2000
  db.Model(&product).Update("Price", 2000)

  // 删除 - 删除product
  db.Delete(&product)
}
```

## 数据库

### 连接数据库 {dbc}
要连接到数据库首先要导入驱动程序。例如
``` go
import _ "github.com/go-sql-driver/mysql"
```
为了方便记住导入路径，GORM包装了一些驱动。
```go
import _ "github.com/jinzhu/gorm/dialects/mysql"
// import _ "github.com/jinzhu/gorm/dialects/postgres"
// import _ "github.com/jinzhu/gorm/dialects/sqlite"
// import _ "github.com/jinzhu/gorm/dialects/mssql"
```

#### MySQL
注：为了处理`time.Time`，您需要包括`parseTime`作为参数。 （[更多支持的参数](https://github.com/go-sql-driver/mysql#parameters)）
``` go
import (
    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/mysql"
)

func main() {
  db, err := gorm.Open("mysql", "user:password@/dbname?charset=utf8&parseTime=True&loc=Local")
  defer db.Close()
}
```

#### PostgreSQL
``` go
import (
    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/postgres"
)

func main() {
  db, err := gorm.Open("postgres", "host=myhost user=gorm dbname=gorm sslmode=disable password=mypassword")
  defer db.Close()
}
```

#### Sqlite3
```
import (
    "github.com/jinzhu/gorm"
    _ "github.com/jinzhu/gorm/dialects/sqlite"
)

func main() {
  db, err := gorm.Open("sqlite3", "/tmp/gorm.db")
  defer db.Close()
}
```

#### 不支持的数据库
GORM正式支持上述的数据库，如果您使用的是不受支持的数据库请按照下面的连接编写对应数据库支持文件。
[https://github.com/jinzhu/gorm/blob/master/dialect.go](https://github.com/jinzhu/gorm/blob/master/dialect.go)



### 迁移 {m}

#### 自动迁移
自动迁移模式将保持更新到最新。

> 自动迁移**仅仅**会创建表，缺少列和索引，并且不会改变现有列的类型或删除未使用的列以保护数据。

``` go
db.AutoMigrate(&User{})

db.AutoMigrate(&User{}, &Product{}, &Order{})

// 创建表时添加表后缀
db.Set("gorm:table_options", "ENGINE=InnoDB").AutoMigrate(&User{})
```

#### 检查表是否存在
``` go
// 检查模型`User`表是否存在
db.HasTable(&User{})

// 检查表`users`是否存在
db.HasTable("users")
```

#### 创建表
``` go
// 为模型`User`创建表
db.CreateTable(&User{})

// 创建表`users'时将“ENGINE = InnoDB”附加到SQL语句
db.Set("gorm:table_options", "ENGINE=InnoDB").CreateTable(&User{})
```

#### 删除表
``` go
// 删除模型`User`的表
db.DropTable(&User{})

// 删除表`users`
db.DropTable("users")

// 删除模型`User`的表和表`products`
db.DropTableIfExists(&User{}, "products")
```

#### 修改列
修改列的类型为给定值
```go
// 修改模型`User`的description列的数据类型为`text`
db.Model(&User{}).ModifyColumn("description", "text")
```

#### 删除列
``` go
// 删除模型`User`的description列
db.Model(&User{}).DropColumn("description")
```

#### 添加外键
```go
// 添加主键
// 1st param : 外键字段
// 2nd param : 外键表(字段)
// 3rd param : ONDELETE
// 4th param : ONUPDATE
db.Model(&User{}).AddForeignKey("city_id", "cities(id)", "RESTRICT", "RESTRICT")
```

#### 索引
``` go
// 为`name`列添加索引`idx_user_name`
db.Model(&User{}).AddIndex("idx_user_name", "name")

// 为`name`, `age`列添加索引`idx_user_name_age`
db.Model(&User{}).AddIndex("idx_user_name_age", "name", "age")

// 添加唯一索引
db.Model(&User{}).AddUniqueIndex("idx_user_name", "name")

// 为多列添加唯一索引
db.Model(&User{}).AddUniqueIndex("idx_user_name_age", "name", "age")

// 删除索引
db.Model(&User{}).RemoveIndex("idx_user_name")
```

## 模型

### 模型定义 {md}
``` go
type User struct {
    gorm.Model
    Birthday     time.Time
    Age          int
    Name         string  `gorm:"size:255"`       // string默认长度为255, 使用这种tag重设。
    Num          int     `gorm:"AUTO_INCREMENT"` // 自增

    CreditCard        CreditCard      // One-To-One (拥有一个 - CreditCard表的UserID作外键)
    Emails            []Email         // One-To-Many (拥有多个 - Email表的UserID作外键)

    BillingAddress    Address         // One-To-One (属于 - 本表的BillingAddressID作外键)
    BillingAddressID  sql.NullInt64

    ShippingAddress   Address         // One-To-One (属于 - 本表的ShippingAddressID作外键)
    ShippingAddressID int

    IgnoreMe          int `gorm:"-"`   // 忽略这个字段
    Languages         []Language `gorm:"many2many:user_languages;"` // Many-To-Many , 'user_languages'是连接表
}

type Email struct {
    ID      int
    UserID  int     `gorm:"index"` // 外键 (属于), tag `index`是为该列创建索引
    Email   string  `gorm:"type:varchar(100);unique_index"` // `type`设置sql类型, `unique_index` 为该列设置唯一索引
    Subscribed bool
}

type Address struct {
    ID       int
    Address1 string         `gorm:"not null;unique"` // 设置字段为非空并唯一
    Address2 string         `gorm:"type:varchar(100);unique"`
    Post     sql.NullString `gorm:"not null"`
}

type Language struct {
    ID   int
    Name string `gorm:"index:idx_name_code"` // 创建索引并命名，如果找到其他相同名称的索引则创建组合索引
    Code string `gorm:"index:idx_name_code"` // `unique_index` also works
}

type CreditCard struct {
    gorm.Model
    UserID  uint
    Number  string
}
```
### 约定 {c}
#### `gorm.Model` 结构体
基本模型定义`gorm.Model`，包括字段`ID`，`CreatedAt`，`UpdatedAt`，`DeletedAt`，你可以将它嵌入你的模型，或者只写你想要的字段
``` go
// 基本模型的定义
type Model struct {
  ID        uint `gorm:"primary_key"`
  CreatedAt time.Time
  UpdatedAt time.Time
  DeletedAt *time.Time
}

// 添加字段 `ID`, `CreatedAt`, `UpdatedAt`, `DeletedAt`
type User struct {
  gorm.Model
  Name string
}

// 只需要字段 `ID`, `CreatedAt`
type User struct {
  ID        uint
  CreatedAt time.Time
  Name      string
}
```
#### 表名是结构体名称的复数形式
```go
type User struct {} // 默认表名是`users`

// 设置User的表名为`profiles`
func (User) TableName() string {
  return "profiles"
}

func (u User) TableName() string {
    if u.Role == "admin" {
        return "admin_users"
    } else {
        return "users"
    }
}

// 全局禁用表名复数
db.SingularTable(true) // 如果设置为true,`User`的默认表名为`user`,使用`TableName`设置的表名不受影响

```
#### 更改默认表名
您可以通过定义`DefaultTableNameHandler`对默认表名应用任何规则。
```go
gorm.DefaultTableNameHandler = func (db *gorm.DB, defaultTableName string) string  {
    return "prefix_" + defaultTableName;
}
```

#### 列名是字段名的蛇形小写
```go
type User struct {
  ID uint             // 列名为 `id`
  Name string         // 列名为 `name`
  Birthday time.Time  // 列名为 `birthday`
  CreatedAt time.Time // 列名为 `created_at`
}

// 重设列名
type Animal struct {
    AnimalId    int64     `gorm:"column:beast_id"`         // 设置列名为`beast_id`
    Birthday    time.Time `gorm:"column:day_of_the_beast"` // 设置列名为`day_of_the_beast`
    Age         int64     `gorm:"column:age_of_the_beast"` // 设置列名为`age_of_the_beast`
}
```

#### 字段`ID`为主键
```go
type User struct {
  ID   uint  // 字段`ID`为默认主键
  Name string
}

// 使用tag`primary_key`用来设置主键
type Animal struct {
  AnimalId int64 `gorm:"primary_key"` // 设置AnimalId为主键
  Name     string
  Age      int64
}
```

#### 字段`CreatedAt`用于存储记录的创建时间
创建具有`CreatedAt`字段的记录将被设置为当前时间
```go
db.Create(&user) // 将会设置`CreatedAt`为当前时间

// 要更改它的值, 你需要使用`Update`
db.Model(&user).Update("CreatedAt", time.Now())
```

#### 字段`UpdatedAt`用于存储记录的修改时间
保存具有`UpdatedAt`字段的记录将被设置为当前时间
```go
db.Save(&user) // 将会设置`UpdatedAt`为当前时间
db.Model(&user).Update("name", "jinzhu") // 将会设置`UpdatedAt`为当前时间
```

#### 字段`DeletedAt`用于存储记录的删除时间，如果字段存在
删除具有`DeletedAt`字段的记录，它不会冲数据库中删除，但只将字段`DeletedAt`设置为当前时间，并在查询时无法找到记录，请参阅[软删除](http://gorm.book.jasperxu.com/crud.html#sd)

### 关联

#### 属于 {bt}
```go
// `User`属于`Profile`, `ProfileID`为外键
type User struct {
  gorm.Model
  Profile   Profile
  ProfileID int
}

type Profile struct {
  gorm.Model
  Name string
}

db.Model(&user).Related(&profile)
//// SELECT * FROM profiles WHERE id = 111; // 111是user的外键ProfileID
```
指定外键
```go
type Profile struct {
    gorm.Model
    Name string
}

type User struct {
    gorm.Model
    Profile      Profile `gorm:"ForeignKey:ProfileRefer"` // 使用ProfileRefer作为外键
    ProfileRefer int
}
```
指定外键和关联外键
```go
type Profile struct {
    gorm.Model
    Refer string
    Name  string
}

type User struct {
    gorm.Model
    Profile   Profile `gorm:"ForeignKey:ProfileID;AssociationForeignKey:Refer"`
    ProfileID int
}
```
#### 包含一个 {ho}
```go
// User 包含一个 CreditCard, UserID 为外键
type User struct {
    gorm.Model
    CreditCard   CreditCard
}

type CreditCard struct {
    gorm.Model
    UserID   uint
    Number   string
}

var card CreditCard
db.Model(&user).Related(&card, "CreditCard")
//// SELECT * FROM credit_cards WHERE user_id = 123; // 123 is user's primary key
// CreditCard是user的字段名称，这意味着获得user的CreditCard关系并将其填充到变量
// 如果字段名与变量的类型名相同，如上例所示，可以省略，如：
db.Model(&user).Related(&card)
```
指定外键
```go
type Profile struct {
  gorm.Model
  Name      string
  UserRefer uint
}

type User struct {
  gorm.Model
  Profile Profile `gorm:"ForeignKey:UserRefer"`
}
```
指定外键和关联外键
```go
type Profile struct {
  gorm.Model
  Name   string
  UserID uint
}

type User struct {
  gorm.Model
  Refer   string
  Profile Profile `gorm:"ForeignKey:UserID;AssociationForeignKey:Refer"`
}
```

#### 包含多个 {hm}
```go
// User 包含多个 emails, UserID 为外键
type User struct {
    gorm.Model
    Emails   []Email
}

type Email struct {
    gorm.Model
    Email   string
    UserID  uint
}

db.Model(&user).Related(&emails)
//// SELECT * FROM emails WHERE user_id = 111; // 111 是 user 的主键
```
指定外键
```go
type Profile struct {
  gorm.Model
  Name      string
  UserRefer uint
}

type User struct {
  gorm.Model
  Profiles []Profile `gorm:"ForeignKey:UserRefer"`
}
```
指定外键和关联外键
```go
type Profile struct {
  gorm.Model
  Name   string
  UserID uint
}

type User struct {
  gorm.Model
  Refer   string
  Profiles []Profile `gorm:"ForeignKey:UserID;AssociationForeignKey:Refer"`
}
```
#### 多对多 {mtm}
```go
// User 包含并属于多个 languages, 使用 `user_languages` 表连接
type User struct {
    gorm.Model
    Languages         []Language `gorm:"many2many:user_languages;"`
}

type Language struct {
    gorm.Model
    Name string
}

db.Model(&user).Related(&languages, "Languages")
//// SELECT * FROM "languages" INNER JOIN "user_languages" ON "user_languages"."language_id" = "languages"."id" WHERE "user_languages"."user_id" = 111
```
指定外键和关联外键
```go
type CustomizePerson struct {
  IdPerson string             `gorm:"primary_key:true"`
  Accounts []CustomizeAccount `gorm:"many2many:PersonAccount;ForeignKey:IdPerson;AssociationForeignKey:IdAccount"`
}

type CustomizeAccount struct {
  IdAccount string `gorm:"primary_key:true"`
  Name      string
}
```
译者注：这里设置好像缺失一部分
#### 多种包含 {p}
支持多种的包含一个和包含多个的关联
```go
type Cat struct {
    Id    int
    Name  string
    Toy   Toy `gorm:"polymorphic:Owner;"`
  }

  type Dog struct {
    Id   int
    Name string
    Toy  Toy `gorm:"polymorphic:Owner;"`
  }

  type Toy struct {
    Id        int
    Name      string
    OwnerId   int
    OwnerType string
  }
```
注意：多态属性和多对多显式不支持，并且会抛出错误。

#### 关联模式 {am}
关联模式包含一些帮助方法来处理关系事情很容易。
```go
// 开始关联模式
var user User
db.Model(&user).Association("Languages")
// `user`是源，它需要是一个有效的记录（包含主键）
// `Languages`是关系中源的字段名。
// 如果这些条件不匹配，将返回一个错误，检查它：
// db.Model(&user).Association("Languages").Error


// Query - 查找所有相关关联
db.Model(&user).Association("Languages").Find(&languages)


// Append - 添加新的many2many, has_many关联, 会替换掉当前 has_one, belongs_to关联
db.Model(&user).Association("Languages").Append([]Language{languageZH, languageEN})
db.Model(&user).Association("Languages").Append(Language{Name: "DE"})


// Delete - 删除源和传递的参数之间的关系，不会删除这些参数
db.Model(&user).Association("Languages").Delete([]Language{languageZH, languageEN})
db.Model(&user).Association("Languages").Delete(languageZH, languageEN)


// Replace - 使用新的关联替换当前关联
db.Model(&user).Association("Languages").Replace([]Language{languageZH, languageEN})
db.Model(&user).Association("Languages").Replace(Language{Name: "DE"}, languageEN)


// Count - 返回当前关联的计数
db.Model(&user).Association("Languages").Count()


// Clear - 删除源和当前关联之间的关系，不会删除这些关联
db.Model(&user).Association("Languages").Clear()
```

## CRUD:读写数据
<!-- toc -->
### 创建 {c}
#### 创建记录
```go
user := User{Name: "Jinzhu", Age: 18, Birthday: time.Now()}

db.NewRecord(user) // => 主键为空返回`true`

db.Create(&user)

db.NewRecord(user) // => 创建`user`后返回`false`
```
#### 默认值
您可以在gorm tag中定义默认值，然后插入SQL将忽略具有默认值的这些字段，并且其值为空，并且在将记录插入数据库后，gorm将从数据库加载这些字段的值。
```go
type Animal struct {
    ID   int64
    Name string `gorm:"default:'galeone'"`
    Age  int64
}

var animal = Animal{Age: 99, Name: ""}
db.Create(&animal)
// INSERT INTO animals("age") values('99');
// SELECT name from animals WHERE ID=111; // 返回主键为 111
// animal.Name => 'galeone'
```
#### 在Callbacks中设置主键
如果要在BeforeCreate回调中设置主字段的值，可以使用scope.SetColumn，例如：
```go
func (user *User) BeforeCreate(scope *gorm.Scope) error {
  scope.SetColumn("ID", uuid.New())
  return nil
}
```
#### 扩展创建选项
```go
// 为Instert语句添加扩展SQL选项
db.Set("gorm:insert_option", "ON CONFLICT").Create(&product)
// INSERT INTO products (name, code) VALUES ("name", "code") ON CONFLICT;
```
### 查询 {q}
```go
// 获取第一条记录，按主键排序
db.First(&user)
//// SELECT * FROM users ORDER BY id LIMIT 1;

// 获取最后一条记录，按主键排序
db.Last(&user)
//// SELECT * FROM users ORDER BY id DESC LIMIT 1;

// 获取所有记录
db.Find(&users)
//// SELECT * FROM users;

// 使用主键获取记录
db.First(&user, 10)
//// SELECT * FROM users WHERE id = 10;
```
#### Where查询条件 (简单SQL)
```go
// 获取第一个匹配记录
db.Where("name = ?", "jinzhu").First(&user)
//// SELECT * FROM users WHERE name = 'jinzhu' limit 1;

// 获取所有匹配记录
db.Where("name = ?", "jinzhu").Find(&users)
//// SELECT * FROM users WHERE name = 'jinzhu';

db.Where("name <> ?", "jinzhu").Find(&users)

// IN
db.Where("name in (?)", []string{"jinzhu", "jinzhu 2"}).Find(&users)

// LIKE
db.Where("name LIKE ?", "%jin%").Find(&users)

// AND
db.Where("name = ? AND age >= ?", "jinzhu", "22").Find(&users)

// Time
db.Where("updated_at > ?", lastWeek).Find(&users)

db.Where("created_at BETWEEN ? AND ?", lastWeek, today).Find(&users)
```
#### Where查询条件 (Struct & Map)
注意：当使用struct查询时，GORM将只查询那些具有值的字段
```go
// Struct
db.Where(&User{Name: "jinzhu", Age: 20}).First(&user)
//// SELECT * FROM users WHERE name = "jinzhu" AND age = 20 LIMIT 1;

// Map
db.Where(map[string]interface{}{"name": "jinzhu", "age": 20}).Find(&users)
//// SELECT * FROM users WHERE name = "jinzhu" AND age = 20;

// 主键的Slice
db.Where([]int64{20, 21, 22}).Find(&users)
//// SELECT * FROM users WHERE id IN (20, 21, 22);
```
#### Not条件查询
```go
db.Not("name", "jinzhu").First(&user)
//// SELECT * FROM users WHERE name <> "jinzhu" LIMIT 1;

// Not In
db.Not("name", []string{"jinzhu", "jinzhu 2"}).Find(&users)
//// SELECT * FROM users WHERE name NOT IN ("jinzhu", "jinzhu 2");

// Not In slice of primary keys
db.Not([]int64{1,2,3}).First(&user)
//// SELECT * FROM users WHERE id NOT IN (1,2,3);

db.Not([]int64{}).First(&user)
//// SELECT * FROM users;

// Plain SQL
db.Not("name = ?", "jinzhu").First(&user)
//// SELECT * FROM users WHERE NOT(name = "jinzhu");

// Struct
db.Not(User{Name: "jinzhu"}).First(&user)
//// SELECT * FROM users WHERE name <> "jinzhu";
```

#### 带内联条件的查询
注意：使用主键查询时，应仔细检查所传递的值是否为有效主键，以避免SQL注入
```go
// 按主键获取
db.First(&user, 23)
//// SELECT * FROM users WHERE id = 23 LIMIT 1;

// 简单SQL
db.Find(&user, "name = ?", "jinzhu")
//// SELECT * FROM users WHERE name = "jinzhu";

db.Find(&users, "name <> ? AND age > ?", "jinzhu", 20)
//// SELECT * FROM users WHERE name <> "jinzhu" AND age > 20;

// Struct
db.Find(&users, User{Age: 20})
//// SELECT * FROM users WHERE age = 20;

// Map
db.Find(&users, map[string]interface{}{"age": 20})
//// SELECT * FROM users WHERE age = 20;
```

#### Or条件查询
```go
db.Where("role = ?", "admin").Or("role = ?", "super_admin").Find(&users)
//// SELECT * FROM users WHERE role = 'admin' OR role = 'super_admin';

// Struct
db.Where("name = 'jinzhu'").Or(User{Name: "jinzhu 2"}).Find(&users)
//// SELECT * FROM users WHERE name = 'jinzhu' OR name = 'jinzhu 2';

// Map
db.Where("name = 'jinzhu'").Or(map[string]interface{}{"name": "jinzhu 2"}).Find(&users)
```
#### 查询链
Gorm有一个可链接的API，你可以这样使用它
```go
db.Where("name <> ?","jinzhu").Where("age >= ? and role <> ?",20,"admin").Find(&users)
//// SELECT * FROM users WHERE name <> 'jinzhu' AND age >= 20 AND role <> 'admin';

db.Where("role = ?", "admin").Or("role = ?", "super_admin").Not("name = ?", "jinzhu").Find(&users)
```
#### 扩展查询选项
```go
// 为Select语句添加扩展SQL选项
db.Set("gorm:query_option", "FOR UPDATE").First(&user, 10)
//// SELECT * FROM users WHERE id = 10 FOR UPDATE;
```
#### FirstOrInit
获取第一个匹配的记录，或者使用给定的条件初始化一个新的记录（仅适用于struct，map条件）
```go
// Unfound
db.FirstOrInit(&user, User{Name: "non_existing"})
//// user -> User{Name: "non_existing"}

// Found
db.Where(User{Name: "Jinzhu"}).FirstOrInit(&user)
//// user -> User{Id: 111, Name: "Jinzhu", Age: 20}
db.FirstOrInit(&user, map[string]interface{}{"name": "jinzhu"})
//// user -> User{Id: 111, Name: "Jinzhu", Age: 20}
```
#### Attrs
如果未找到记录，则使用参数初始化结构
```go
// Unfound
db.Where(User{Name: "non_existing"}).Attrs(User{Age: 20}).FirstOrInit(&user)
//// SELECT * FROM USERS WHERE name = 'non_existing';
//// user -> User{Name: "non_existing", Age: 20}

db.Where(User{Name: "non_existing"}).Attrs("age", 20).FirstOrInit(&user)
//// SELECT * FROM USERS WHERE name = 'non_existing';
//// user -> User{Name: "non_existing", Age: 20}

// Found
db.Where(User{Name: "Jinzhu"}).Attrs(User{Age: 30}).FirstOrInit(&user)
//// SELECT * FROM USERS WHERE name = jinzhu';
//// user -> User{Id: 111, Name: "Jinzhu", Age: 20}
```
#### Assign
将参数分配给结果，不管它是否被找到
```go
// Unfound
db.Where(User{Name: "non_existing"}).Assign(User{Age: 20}).FirstOrInit(&user)
//// user -> User{Name: "non_existing", Age: 20}

// Found
db.Where(User{Name: "Jinzhu"}).Assign(User{Age: 30}).FirstOrInit(&user)
//// SELECT * FROM USERS WHERE name = jinzhu';
//// user -> User{Id: 111, Name: "Jinzhu", Age: 30}
```
#### FirstOrCreate
获取第一个匹配的记录，或创建一个具有给定条件的新记录（仅适用于struct, map条件）
```go
// Unfound
db.FirstOrCreate(&user, User{Name: "non_existing"})
//// INSERT INTO "users" (name) VALUES ("non_existing");
//// user -> User{Id: 112, Name: "non_existing"}

// Found
db.Where(User{Name: "Jinzhu"}).FirstOrCreate(&user)
//// user -> User{Id: 111, Name: "Jinzhu"}
```
#### Attrs
如果未找到记录，则为参数分配结构
```go
// Unfound
db.Where(User{Name: "non_existing"}).Attrs(User{Age: 20}).FirstOrCreate(&user)
//// SELECT * FROM users WHERE name = 'non_existing';
//// INSERT INTO "users" (name, age) VALUES ("non_existing", 20);
//// user -> User{Id: 112, Name: "non_existing", Age: 20}

// Found
db.Where(User{Name: "jinzhu"}).Attrs(User{Age: 30}).FirstOrCreate(&user)
//// SELECT * FROM users WHERE name = 'jinzhu';
//// user -> User{Id: 111, Name: "jinzhu", Age: 20}
```
#### Assign
将其分配给记录，而不管它是否被找到，并保存回数据库。
```go
// Unfound
db.Where(User{Name: "non_existing"}).Assign(User{Age: 20}).FirstOrCreate(&user)
//// SELECT * FROM users WHERE name = 'non_existing';
//// INSERT INTO "users" (name, age) VALUES ("non_existing", 20);
//// user -> User{Id: 112, Name: "non_existing", Age: 20}

// Found
db.Where(User{Name: "jinzhu"}).Assign(User{Age: 30}).FirstOrCreate(&user)
//// SELECT * FROM users WHERE name = 'jinzhu';
//// UPDATE users SET age=30 WHERE id = 111;
//// user -> User{Id: 111, Name: "jinzhu", Age: 30}
```
#### Select
指定要从数据库检索的字段，默认情况下，将选择所有字段;
```go
db.Select("name, age").Find(&users)
//// SELECT name, age FROM users;

db.Select([]string{"name", "age"}).Find(&users)
//// SELECT name, age FROM users;

db.Table("users").Select("COALESCE(age,?)", 42).Rows()
//// SELECT COALESCE(age,'42') FROM users;
```
#### Order
在从数据库检索记录时指定顺序，将重排序设置为`true`以覆盖定义的条件
```go
db.Order("age desc, name").Find(&users)
//// SELECT * FROM users ORDER BY age desc, name;

// Multiple orders
db.Order("age desc").Order("name").Find(&users)
//// SELECT * FROM users ORDER BY age desc, name;

// ReOrder
db.Order("age desc").Find(&users1).Order("age", true).Find(&users2)
//// SELECT * FROM users ORDER BY age desc; (users1)
//// SELECT * FROM users ORDER BY age; (users2)
```
#### Limit
指定要检索的记录数
```go
db.Limit(3).Find(&users)
//// SELECT * FROM users LIMIT 3;

// Cancel limit condition with -1
db.Limit(10).Find(&users1).Limit(-1).Find(&users2)
//// SELECT * FROM users LIMIT 10; (users1)
//// SELECT * FROM users; (users2)
```

#### Offset
指定在开始返回记录之前要跳过的记录数
```go
db.Offset(3).Find(&users)
//// SELECT * FROM users OFFSET 3;

// Cancel offset condition with -1
db.Offset(10).Find(&users1).Offset(-1).Find(&users2)
//// SELECT * FROM users OFFSET 10; (users1)
//// SELECT * FROM users; (users2)
```

#### Count
获取模型的记录数
```go
db.Where("name = ?", "jinzhu").Or("name = ?", "jinzhu 2").Find(&users).Count(&count)
//// SELECT * from USERS WHERE name = 'jinzhu' OR name = 'jinzhu 2'; (users)
//// SELECT count(*) FROM users WHERE name = 'jinzhu' OR name = 'jinzhu 2'; (count)

db.Model(&User{}).Where("name = ?", "jinzhu").Count(&count)
//// SELECT count(*) FROM users WHERE name = 'jinzhu'; (count)

db.Table("deleted_users").Count(&count)
//// SELECT count(*) FROM deleted_users;
```

#### Group & Having
```go
rows, err := db.Table("orders").Select("date(created_at) as date, sum(amount) as total").Group("date(created_at)").Rows()
for rows.Next() {
    ...
}

rows, err := db.Table("orders").Select("date(created_at) as date, sum(amount) as total").Group("date(created_at)").Having("sum(amount) > ?", 100).Rows()
for rows.Next() {
    ...
}

type Result struct {
    Date  time.Time
    Total int64
}
db.Table("orders").Select("date(created_at) as date, sum(amount) as total").Group("date(created_at)").Having("sum(amount) > ?", 100).Scan(&results)
```

#### Join
指定连接条件
```go
rows, err := db.Table("users").Select("users.name, emails.email").Joins("left join emails on emails.user_id = users.id").Rows()
for rows.Next() {
    ...
}

db.Table("users").Select("users.name, emails.email").Joins("left join emails on emails.user_id = users.id").Scan(&results)

// 多个连接与参数
db.Joins("JOIN emails ON emails.user_id = users.id AND emails.email = ?", "jinzhu@example.org").Joins("JOIN credit_cards ON credit_cards.user_id = users.id").Where("credit_cards.number = ?", "411111111111").Find(&user)
```

#### Pluck
将模型中的单个列作为地图查询，如果要查询多个列，可以使用[Scan](#Scan)
```go
var ages []int64
db.Find(&users).Pluck("age", &ages)

var names []string
db.Model(&User{}).Pluck("name", &names)

db.Table("deleted_users").Pluck("name", &names)

// 要返回多个列，做这样：
db.Select("name, age").Find(&users)
```

#### Scan {Scan}
将结果扫描到另一个结构中。
```go
type Result struct {
    Name string
    Age  int
}

var result Result
db.Table("users").Select("name, age").Where("name = ?", 3).Scan(&result)

// Raw SQL
db.Raw("SELECT name, age FROM users WHERE name = ?", 3).Scan(&result)
```

#### Scopes {Scopes}
将当前数据库连接传递到`func(*DB) *DB`，可以用于动态添加条件
```go
func AmountGreaterThan1000(db *gorm.DB) *gorm.DB {
    return db.Where("amount > ?", 1000)
}

func PaidWithCreditCard(db *gorm.DB) *gorm.DB {
    return db.Where("pay_mode_sign = ?", "C")
}

func PaidWithCod(db *gorm.DB) *gorm.DB {
    return db.Where("pay_mode_sign = ?", "C")
}

func OrderStatus(status []string) func (db *gorm.DB) *gorm.DB {
    return func (db *gorm.DB) *gorm.DB {
        return db.Scopes(AmountGreaterThan1000).Where("status in (?)", status)
    }
}

db.Scopes(AmountGreaterThan1000, PaidWithCreditCard).Find(&orders)
// 查找所有信用卡订单和金额大于1000

db.Scopes(AmountGreaterThan1000, PaidWithCod).Find(&orders)
// 查找所有COD订单和金额大于1000

db.Scopes(OrderStatus([]string{"paid", "shipped"})).Find(&orders)
// 查找所有付费，发货订单
```
#### 指定表名
```go
// 使用User结构定义创建`deleted_users`表
db.Table("deleted_users").CreateTable(&User{})

var deleted_users []User
db.Table("deleted_users").Find(&deleted_users)
//// SELECT * FROM deleted_users;

db.Table("deleted_users").Where("name = ?", "jinzhu").Delete()
//// DELETE FROM deleted_users WHERE name = 'jinzhu';
```

### 预加载 {p}
```go
db.Preload("Orders").Find(&users)
//// SELECT * FROM users;
//// SELECT * FROM orders WHERE user_id IN (1,2,3,4);

db.Preload("Orders", "state NOT IN (?)", "cancelled").Find(&users)
//// SELECT * FROM users;
//// SELECT * FROM orders WHERE user_id IN (1,2,3,4) AND state NOT IN ('cancelled');

db.Where("state = ?", "active").Preload("Orders", "state NOT IN (?)", "cancelled").Find(&users)
//// SELECT * FROM users WHERE state = 'active';
//// SELECT * FROM orders WHERE user_id IN (1,2) AND state NOT IN ('cancelled');

db.Preload("Orders").Preload("Profile").Preload("Role").Find(&users)
//// SELECT * FROM users;
//// SELECT * FROM orders WHERE user_id IN (1,2,3,4); // has many
//// SELECT * FROM profiles WHERE user_id IN (1,2,3,4); // has one
//// SELECT * FROM roles WHERE id IN (4,5,6); // belongs to
```
#### 自定义预加载SQL
您可以通过传递`func(db *gorm.DB) *gorm.DB`（与[Scopes](#Scopes)的使用方法相同）来自定义预加载SQL，例如：
```go
db.Preload("Orders", func(db *gorm.DB) *gorm.DB {
    return db.Order("orders.amount DESC")
}).Find(&users)
//// SELECT * FROM users;
//// SELECT * FROM orders WHERE user_id IN (1,2,3,4) order by orders.amount DESC;
```
#### 嵌套预加载
```go
db.Preload("Orders.OrderItems").Find(&users)
db.Preload("Orders", "state = ?", "paid").Preload("Orders.OrderItems").Find(&users)
```

### 更新 {u}
#### 更新全部字段
`Save`将包括执行更新SQL时的所有字段，即使它没有更改
```go
db.First(&user)

user.Name = "jinzhu 2"
user.Age = 100
db.Save(&user)

//// UPDATE users SET name='jinzhu 2', age=100, birthday='2016-01-01', updated_at = '2013-11-17 21:34:10' WHERE id=111;
```

#### 更新更改字段
如果只想更新更改的字段，可以使用`Update`, `Updates`
```go
// 更新单个属性（如果更改）
db.Model(&user).Update("name", "hello")
//// UPDATE users SET name='hello', updated_at='2013-11-17 21:34:10' WHERE id=111;

// 使用组合条件更新单个属性
db.Model(&user).Where("active = ?", true).Update("name", "hello")
//// UPDATE users SET name='hello', updated_at='2013-11-17 21:34:10' WHERE id=111 AND active=true;

// 使用`map`更新多个属性，只会更新这些更改的字段
db.Model(&user).Updates(map[string]interface{}{"name": "hello", "age": 18, "actived": false})
//// UPDATE users SET name='hello', age=18, actived=false, updated_at='2013-11-17 21:34:10' WHERE id=111;

// 使用`struct`更新多个属性，只会更新这些更改的和非空白字段
db.Model(&user).Updates(User{Name: "hello", Age: 18})
//// UPDATE users SET name='hello', age=18, updated_at = '2013-11-17 21:34:10' WHERE id = 111;

// 警告:当使用struct更新时，FORM将仅更新具有非空值的字段
// 对于下面的更新，什么都不会更新为""，0，false是其类型的空白值
db.Model(&user).Updates(User{Name: "", Age: 0, Actived: false})
```

#### 更新选择的字段
如果您只想在更新时更新或忽略某些字段，可以使用`Select`, `Omit`
```go
db.Model(&user).Select("name").Updates(map[string]interface{}{"name": "hello", "age": 18, "actived": false})
//// UPDATE users SET name='hello', updated_at='2013-11-17 21:34:10' WHERE id=111;

db.Model(&user).Omit("name").Updates(map[string]interface{}{"name": "hello", "age": 18, "actived": false})
//// UPDATE users SET age=18, actived=false, updated_at='2013-11-17 21:34:10' WHERE id=111;
```

#### 更新更改字段但不进行Callbacks
以上更新操作将执行模型的`BeforeUpdate`, `AfterUpdate`方法，更新其`UpdatedAt`时间戳，在更新时保存它的`Associations `，如果不想调用它们，可以使用`UpdateColumn`, `UpdateColumns`
```go
// 更新单个属性，类似于`Update`
db.Model(&user).UpdateColumn("name", "hello")
//// UPDATE users SET name='hello' WHERE id = 111;

// 更新多个属性，与“更新”类似
db.Model(&user).UpdateColumns(User{Name: "hello", Age: 18})
//// UPDATE users SET name='hello', age=18 WHERE id = 111;
```

#### Batch Updates 批量更新
`Callbacks`在批量更新时不会运行
```go
db.Table("users").Where("id IN (?)", []int{10, 11}).Updates(map[string]interface{}{"name": "hello", "age": 18})
//// UPDATE users SET name='hello', age=18 WHERE id IN (10, 11);

// 使用struct更新仅适用于非零值，或使用map[string]interface{}
db.Model(User{}).Updates(User{Name: "hello", Age: 18})
//// UPDATE users SET name='hello', age=18;

// 使用`RowsAffected`获取更新记录计数
db.Model(User{}).Updates(User{Name: "hello", Age: 18}).RowsAffected
```

#### 使用SQL表达式更新
```go
DB.Model(&product).Update("price", gorm.Expr("price * ? + ?", 2, 100))
//// UPDATE "products" SET "price" = price * '2' + '100', "updated_at" = '2013-11-17 21:34:10' WHERE "id" = '2';

DB.Model(&product).Updates(map[string]interface{}{"price": gorm.Expr("price * ? + ?", 2, 100)})
//// UPDATE "products" SET "price" = price * '2' + '100', "updated_at" = '2013-11-17 21:34:10' WHERE "id" = '2';

DB.Model(&product).UpdateColumn("quantity", gorm.Expr("quantity - ?", 1))
//// UPDATE "products" SET "quantity" = quantity - 1 WHERE "id" = '2';

DB.Model(&product).Where("quantity > 1").UpdateColumn("quantity", gorm.Expr("quantity - ?", 1))
//// UPDATE "products" SET "quantity" = quantity - 1 WHERE "id" = '2' AND quantity > 1;
```

#### 在Callbacks中更改更新值
如果要使用`BeforeUpdate`, `BeforeSave`更改回调中的更新值，可以使用`scope.SetColumn`，例如
```go
func (user *User) BeforeSave(scope *gorm.Scope) (err error) {
  if pw, err := bcrypt.GenerateFromPassword(user.Password, 0); err == nil {
    scope.SetColumn("EncryptedPassword", pw)
  }
}
```

#### 额外更新选项
```go
// 为Update语句添加额外的SQL选项
db.Model(&user).Set("gorm:update_option", "OPTION (OPTIMIZE FOR UNKNOWN)").Update("name, "hello")
//// UPDATE users SET name='hello', updated_at = '2013-11-17 21:34:10' WHERE id=111 OPTION (OPTIMIZE FOR UNKNOWN);
```

### 删除/软删除 {d}
**警告** 删除记录时，需要确保其主要字段具有值，GORM将使用主键删除记录，如果主要字段为空，GORM将删除模型的所有记录
```go
// 删除存在的记录
db.Delete(&email)
//// DELETE from emails where id=10;

// 为Delete语句添加额外的SQL选项
db.Set("gorm:delete_option", "OPTION (OPTIMIZE FOR UNKNOWN)").Delete(&email)
//// DELETE from emails where id=10 OPTION (OPTIMIZE FOR UNKNOWN);
```
#### 批量删除
删除所有匹配记录
```go
db.Where("email LIKE ?", "%jinzhu%").Delete(Email{})
//// DELETE from emails where email LIKE "%jinhu%";

db.Delete(Email{}, "email LIKE ?", "%jinzhu%")
//// DELETE from emails where email LIKE "%jinhu%";
```
#### 软删除
如果模型有`DeletedAt`字段，它将自动获得软删除功能！ 那么在调用`Delete`时不会从数据库中永久删除，而是只将字段`DeletedAt`的值设置为当前时间。
```go
db.Delete(&user)
//// UPDATE users SET deleted_at="2013-10-29 10:23" WHERE id = 111;

// 批量删除
db.Where("age = ?", 20).Delete(&User{})
//// UPDATE users SET deleted_at="2013-10-29 10:23" WHERE age = 20;

// 软删除的记录将在查询时被忽略
db.Where("age = 20").Find(&user)
//// SELECT * FROM users WHERE age = 20 AND deleted_at IS NULL;

// 使用Unscoped查找软删除的记录
db.Unscoped().Where("age = 20").Find(&users)
//// SELECT * FROM users WHERE age = 20;

// 使用Unscoped永久删除记录
db.Unscoped().Delete(&order)
//// DELETE FROM orders WHERE id=10;
```

### 关联 {a}
默认情况下，当创建/更新记录时，GORM将保存其关联，如果关联具有主键，GORM将调用Update来保存它，否则将被创建。
```go
user := User{
    Name:            "jinzhu",
    BillingAddress:  Address{Address1: "Billing Address - Address 1"},
    ShippingAddress: Address{Address1: "Shipping Address - Address 1"},
    Emails:          []Email{
                                        {Email: "jinzhu@example.com"},
                                        {Email: "jinzhu-2@example@example.com"},
                   },
    Languages:       []Language{
                     {Name: "ZH"},
                     {Name: "EN"},
                   },
}

db.Create(&user)
//// BEGIN TRANSACTION;
//// INSERT INTO "addresses" (address1) VALUES ("Billing Address - Address 1");
//// INSERT INTO "addresses" (address1) VALUES ("Shipping Address - Address 1");
//// INSERT INTO "users" (name,billing_address_id,shipping_address_id) VALUES ("jinzhu", 1, 2);
//// INSERT INTO "emails" (user_id,email) VALUES (111, "jinzhu@example.com");
//// INSERT INTO "emails" (user_id,email) VALUES (111, "jinzhu-2@example.com");
//// INSERT INTO "languages" ("name") VALUES ('ZH');
//// INSERT INTO user_languages ("user_id","language_id") VALUES (111, 1);
//// INSERT INTO "languages" ("name") VALUES ('EN');
//// INSERT INTO user_languages ("user_id","language_id") VALUES (111, 2);
//// COMMIT;

db.Save(&user)
```
参考[Associations](https://github.com/jasperxu/gorm-zh/blob/master/associations.md)更多详细信息

#### 创建/更新时跳过保存关联
默认情况下保存记录时，GORM也会保存它的关联，你可以通过设置`gorm:save_associations`为`false`跳过它。
```go
db.Set("gorm:save_associations", false).Create(&user)

db.Set("gorm:save_associations", false).Save(&user)
```

#### tag设置跳过保存关联
您可以使用tag来配置您的struct，以便在创建/更新时不会保存关联
```go
type User struct {
  gorm.Model
  Name      string
  CompanyID uint
  Company   Company `gorm:"save_associations:false"`
}

type Company struct {
  gorm.Model
  Name string
}
```

## Callbacks

您可以将回调方法定义为模型结构的指针，在创建，更新，查询，删除时将被调用，如果任何回调返回错误，gorm将停止未来操作并回滚所有更改。

### 创建对象
创建过程中可用的回调
```go
// begin transaction 开始事务
BeforeSave
BeforeCreate
// save before associations 保存前关联
// update timestamp `CreatedAt`, `UpdatedAt` 更新`CreatedAt`, `UpdatedAt`时间戳
// save self 保存自己
// reload fields that have default value and its value is blank 重新加载具有默认值且其值为空的字段
// save after associations 保存后关联
AfterCreate
AfterSave
// commit or rollback transaction 提交或回滚事务
```

### 更新对象
更新过程中可用的回调
```go
// begin transaction 开始事务
BeforeSave
BeforeUpdate
// save before associations 保存前关联
// update timestamp `UpdatedAt` 更新`UpdatedAt`时间戳
// save self 保存自己
// save after associations 保存后关联
AfterUpdate
AfterSave
// commit or rollback transaction 提交或回滚事务
```
### 删除对象
删除过程中可用的回调
```go
// begin transaction 开始事务
BeforeDelete
// delete self 删除自己
AfterDelete
// commit or rollback transaction 提交或回滚事务
```
### 查询对象 {querying-an-object}
查询过程中可用的回调
```go
// load data from database 从数据库加载数据
// Preloading (edger loading) 预加载（加载）
AfterFind
```

### 回调示例
```go
func (u *User) BeforeUpdate() (err error) {
    if u.readonly() {
        err = errors.New("read only user")
    }
    return
}

// 如果用户ID大于1000，则回滚插入
func (u *User) AfterCreate() (err error) {
    if (u.Id > 1000) {
        err = errors.New("user id is already greater than 1000")
    }
    return
}
```
gorm中的保存/删除操作正在事务中运行，因此在该事务中所做的更改不可见，除非提交。 如果要在回调中使用这些更改，则需要在同一事务中运行SQL。 所以你需要传递当前事务到回调，像这样：
```go
func (u *User) AfterCreate(tx *gorm.DB) (err error) {
    tx.Model(u).Update("role", "admin")
    return
}
```
```go
func (u *User) AfterCreate(scope *gorm.Scope) (err error) {
  scope.DB().Model(u).Update("role", "admin")
    return
}
```

## 高级用法
### 错误处理 {eh}
执行任何操作后，如果发生任何错误，GORM将其设置为`*DB`的`Error`字段
```go
if err := db.Where("name = ?", "jinzhu").First(&user).Error; err != nil {
    // 错误处理...
}

// 如果有多个错误发生，用`GetErrors`获取所有的错误，它返回`[]error`
db.First(&user).Limit(10).Find(&users).GetErrors()

// 检查是否返回RecordNotFound错误
db.Where("name = ?", "hello world").First(&user).RecordNotFound()

if db.Model(&user).Related(&credit_card).RecordNotFound() {
    // 没有信用卡被发现处理...
}
```
### 事务 {t}
要在事务中执行一组操作，一般流程如下。
```go
// 开始事务
tx := db.Begin()

// 在事务中做一些数据库操作（从这一点使用'tx'，而不是'db'）
tx.Create(...)

// ...

// 发生错误时回滚事务
tx.Rollback()

// 或提交事务
tx.Commit()
```
#### 一个具体的例子
```go
func CreateAnimals(db *gorm.DB) err {
  tx := db.Begin()
  // 注意，一旦你在一个事务中，使用tx作为数据库句柄

  if err := tx.Create(&Animal{Name: "Giraffe"}).Error; err != nil {
     tx.Rollback()
     return err
  }

  if err := tx.Create(&Animal{Name: "Lion"}).Error; err != nil {
     tx.Rollback()
     return err
  }

  tx.Commit()
  return nil
}
```
### SQL构建 {sb}
#### 执行原生SQL
```go
db.Exec("DROP TABLE users;")
db.Exec("UPDATE orders SET shipped_at=? WHERE id IN (?)", time.Now, []int64{11,22,33})

// Scan
type Result struct {
    Name string
    Age  int
}

var result Result
db.Raw("SELECT name, age FROM users WHERE name = ?", 3).Scan(&result)
```
#### sql.Row & sql.Rows
获取查询结果为`*sql.Row`或`*sql.Rows`
```go
row := db.Table("users").Where("name = ?", "jinzhu").Select("name, age").Row() // (*sql.Row)
row.Scan(&name, &age)

rows, err := db.Model(&User{}).Where("name = ?", "jinzhu").Select("name, age, email").Rows() // (*sql.Rows, error)
defer rows.Close()
for rows.Next() {
    ...
    rows.Scan(&name, &age, &email)
    ...
}

// Raw SQL
rows, err := db.Raw("select name, age, email from users where name = ?", "jinzhu").Rows() // (*sql.Rows, error)
defer rows.Close()
for rows.Next() {
    ...
    rows.Scan(&name, &age, &email)
    ...
}
```
#### 迭代中使用sql.Rows的Scan
```go
rows, err := db.Model(&User{}).Where("name = ?", "jinzhu").Select("name, age, email").Rows() // (*sql.Rows, error)
defer rows.Close()

for rows.Next() {
  var user User
  db.ScanRows(rows, &user)
  // do something
}
```
### 通用数据库接口sql.DB {g}
从`*gorm.DB`连接获取通用数据库接口[*sql.DB](http://golang.org/pkg/database/sql/#DB)
```go
// 获取通用数据库对象`*sql.DB`以使用其函数
db.DB()

// Ping
db.DB().Ping()
```
#### 连接池
```go
db.DB().SetMaxIdleConns(10)
db.DB().SetMaxOpenConns(100)
```

### 复合主键 {cpk}
将多个字段设置为主键以启用复合主键
```go
type Product struct {
    ID           string `gorm:"primary_key"`
    LanguageCode string `gorm:"primary_key"`
}
```
### 日志 {l}
Gorm有内置的日志记录器支持，默认情况下，它会打印发生的错误
```go
// 启用Logger，显示详细日志
db.LogMode(true)

// 禁用日志记录器，不显示任何日志
db.LogMode(false)

// 调试单个操作，显示此操作的详细日志
db.Debug().Where("name = ?", "jinzhu").First(&User{})
```
#### 自定义日志
参考GORM的默认记录器如何自定义它[https://github.com/jinzhu/gorm/blob/master/logger.go](https://github.com/jinzhu/gorm/blob/master/logger.go)
```go
db.SetLogger(gorm.Logger{revel.TRACE})
db.SetLogger(log.New(os.Stdout, "\r\n", 0))
```

## 开发
### 架构 {a}
Gorm使用可链接的API，`*gorm.DB`是链的桥梁，对于每个链API，它将创建一个新的关系。
```go
db, err := gorm.Open("postgres", "user=gorm dbname=gorm sslmode=disable")

// 创建新关系
db = db.Where("name = ?", "jinzhu")

// 过滤更多
if SomeCondition {
    db = db.Where("age = ?", 20)
} else {
    db = db.Where("age = ?", 30)
}
if YetAnotherCondition {
    db = db.Where("active = ?", 1)
}
```
当我们开始执行任何操作时，GORM将基于当前的`*gorm.DB`创建一个新的`*gorm.Scope`实例
```go
// 执行查询操作
db.First(&user)
```
并且基于当前操作的类型，它将调用注册的`creating`, `updating`, `querying`, `deleting`或`row_querying`回调来运行操作。

对于上面的例子，将调用`querying`，参考[查询回调](https://github.com/jasperxu/gorm-zh/blob/master/callbacks.md#querying-an-object)

### 写插件 {w}
GORM本身由`Callbacks`提供支持，因此您可以根据需要完全自定义GORM
#### 注册新的callback
```go
func updateCreated(scope *Scope) {
    if scope.HasColumn("Created") {
        scope.SetColumn("Created", NowFunc())
    }
}

db.Callback().Create().Register("update_created_at", updateCreated)
// 注册Create进程的回调
```
#### 删除现有的callback
```go
db.Callback().Create().Remove("gorm:create")
// 从Create回调中删除`gorm:create`回调
```

#### 替换现有的callback
```go
db.Callback().Create().Replace("gorm:create", newCreateFunction)
// 使用新函数`newCreateFunction`替换回调`gorm:create`用于创建过程
```

#### 注册callback顺序
```go
db.Callback().Create().Before("gorm:create").Register("update_created_at", updateCreated)
db.Callback().Create().After("gorm:create").Register("update_created_at", updateCreated)
db.Callback().Query().After("gorm:query").Register("my_plugin:after_query", afterQuery)
db.Callback().Delete().After("gorm:delete").Register("my_plugin:after_delete", afterDelete)
db.Callback().Update().Before("gorm:update").Register("my_plugin:before_update", beforeUpdate)
db.Callback().Create().Before("gorm:create").After("gorm:before_create").Register("my_plugin:before_create", beforeCreate)
```

#### 预定义回调
GORM定义了回调以执行其CRUD操作，在开始编写插件之前检查它们。
* [Create callbacks](https://github.com/jinzhu/gorm/blob/master/callback_create.go)
* [Update callbacks](https://github.com/jinzhu/gorm/blob/master/callback_update.go)
* [Query callbacks](https://github.com/jinzhu/gorm/blob/master/callback_query.go)
* [Delete callbacks](https://github.com/jinzhu/gorm/blob/master/callback_delete.go)
* Row Query callbacks
Row Query callbacks将在运行`Row`或`Rows`时被调用，默认情况下没有注册的回调，你可以注册一个新的回调：

```go
func updateTableName(scope *gorm.Scope) {
  scope.Search.Table(scope.TableName() + "_draft") // append `_draft` to table name
}

db.Callback().RowQuery().Register("publish:update_table_name", updateTableName)
```

## 更新日志
### v1.0
#### 破坏性变更
* `gorm.Open`返回类型为`*gorm.DB`而不是`gorm.DB`
* 更新只会更新更改的字段

大多数应用程序不会受到影响，只有当您更改回调中的更新值（如`BeforeSave`，`BeforeUpdate`）时，应该使用`scope.SetColumn`，例如：
```go
func (user *User) BeforeUpdate(scope *gorm.Scope) {
  if pw, err := bcrypt.GenerateFromPassword(user.Password, 0); err == nil {
    scope.SetColumn("EncryptedPassword", pw)
    // user.EncryptedPassword = pw  // 不工作，更新时不会包括EncryptedPassword字段
  }
}
```
* 软删除的默认查询作用域只会检查`deleted_at IS NULL`

之前它会检查deleted_at小于0001-01-02也排除空白时间，如：
```go
SELECT * FROM users WHERE deleted_at IS NULL OR deleted_at <= '0001-01-02'
```
但是没有必要，如果你使用`*time.Time`作为模型的`DeletedAt`，它已经被`gorm.Model`使用了，所以SQL就足够了
```go
SELECT * FROM users WHERE deleted_at IS NULL
```
所以如果你使用`gorm.Model`，那么你是好的，没有什么需要改变，只要确保所有记录的空白时间为`deleted_at`设置为`NULL`，示例迁移脚本：
```go
import (
    "github.com/jinzhu/now"
)

func main() {
  var models = []interface{}{&User{}, &Image{}}
  for _, model := range models {
    db.Unscoped().Model(model).Where("deleted_at < ?", now.MustParse("0001-01-02")).Update("deleted_at", gorm.Expr("NULL"))
  }
}
```
* 新的ToDBName逻辑

在GORM将struct，Field的名称转换为db名称之前，只有那些来自[golint](https://github.com/golang/lint/blob/master/lint.go#L702)的常见初始化（如`HTTP`，`URI`）是特殊处理的。

所以字段`HTTP`的数据库名称将是`http`而不是`h_t_t_p`，但是一些其他的初始化，如`SKU`不在golint，它的数据库名称将是`s_k_u`，这看起来很丑陋，这个版本固定这个，任何大写的初始化应该正确转换。
* 错误`RecordNotFound`已重命名为`ErrRecordNotFound`
* `mssql`驱动程序已从默认驱动程序中删除，导入它用`import _ "github.com/jinzhu/gorm/dialects/mssql"`
* `Hstore`已移至`github.com/jinzhu/gorm/dialects/postgres`