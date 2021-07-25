---
title: Java递归的实践
date: 2020-02-04 19:21:28
category: Java
tags:
  - Java
  - 递归
---

递归指的是方法或函数自身调用自身，适用于一个功能被重复使用，而每一次使用时的参数是由上次的结果来确定的情况。本文介绍了递归在实际工作场景中的应用。

<!--more-->

以下是将一个多层结构数据转换成树形结构的实例，该实例能够很好的展示递归的使用方式。

## 数据

- 原始数据

|id|parentId|value|
|:---:|:---:|:---:|
|1|0|one|
|2|1|two|
|3|1|three|
|4|2|four|
|5|2|five|
|6|3|six|
|7|4|seven|
|8|4|eight|
|9|4|nine|
|10|5|ten|
|11|6|eleven|
|12|9|twelve|

- 层级结构

```json
{
  "id": 1,
  "value": "one",
  "nodes": [
    {
      "id": 2,
      "value": "two",
      "nodes": [
        {
          "id": 4,
          "value": "four",
          "nodes": [
            {
              "id": 7,
              "value": "seven",
              "nodes": []
            },
            {
              "id": 8,
              "value": "eight",
              "nodes": []
            },
            {
              "id": 9,
              "value": "nine",
              "nodes": [
                {
                  "id": 12,
                  "value": "twelve",
                  "nodes": []
                }
              ]
            }
          ]
        },
        {
          "id": 5,
          "value": "five",
          "nodes": [
            {
              "id": 10,
              "value": "ten",
              "nodes": []
            }
          ]
        }
      ]
    },
    {
      "id": 3,
      "value": "three",
      "nodes": [
        {
          "id": 6,
          "value": "six",
          "nodes": [
            {
              "id": 11,
              "value": "eleven",
              "nodes": []
            }
          ]
        }
      ]
    }
  ]
}
```

## Java递归的实现

### 递归得到树形结构

- Model类

```java
public class Item {
    private Integer id;
    private Integer parentId;
    private String value;
    private List<Item> nodes;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public List<Item> getNodes() {
        return nodes;
    }

    public void setNodes(List<Item> nodes) {
        this.nodes = nodes;
    }
}
```

- Mapper类

```java
@Mapper
public interface ItemMapper {
    @Select("select * from table where parentId = #{parentId:INTEGER}")
    List<Item> getSubItemsByParentId(Integer parentId);
    
    @Select("select id from table where parentId = #{parentId:INTEGER}")
    List<Integer> getSubItemIds(Integer parentId);
    
    @Select("select * from table where id = #{id:INTEGER}")
    Item getItemById(Integer id);
}
```

- Service类

```java
public interface ItemService {
    Item getItemTree();
    
    List<Integer> getSubItemIds(Integer itemId);
    
    List<Integer> getParentItemIds(Integer itemId);
}
```

```java
@Service("itemService")
public class ItemServiceImpl implements ItemService {
    @Autowired
    private ItemMapper itemMapper;
    
    @Override
    public Item getItemTree() {
        Item rootItem = itemMapper.getItemById(1);
        setItemTree(1, rootItem);
        return rootItem;
    }
    
    private void setItemTree(Integer itemId, Item item) {
        List<Item> subItems = itemMapper.getSubItemsByParentId(itemId);
        if (subItems != null && subItems.size() > 0) {
            for(Item subItem : subItems) {
                setItemTree(subItem.getId(), subItem);
            }
            item.setNodes(subItems);
        }
    }
}
```

### 递归获取指定item所有父item ID的集合

```java
@Service("itemService")
public class ItemServiceImpl implements ItemService {
    @Autowired
    private ItemMapper itemMapper;
    
    @Override
    public List<Integer> getParentItemIds(Integer itemId) {
        return getParentItemIds(itemId, new ArrayList<>());
    }
    
    private List<Integer> getParentItemIds(Integer itemId, ArrayList<Integer> resultIds) {
        Item item = itemMapper.getItemById(itemId);
        if (item != null && item.getParentId() > 0) {
            resultIds.add(item.getParentId());
            getParentItemIds(item.getParentId(), resultIds);
        }
        return resultIds;
    }
}
```

### 递归获取指定item下所有子item ID的集合

```java
@Service("itemService")
public class ItemServiceImpl implements ItemService {
    @Autowired
    private ItemMapper itemMapper;
    
    @Override
    public List<Integer> getSubItemIds(Integer itemId) {
        return getSubItemIds(itemId, new ArrayList<>());
    }
    
    private List<Integer> getSubItemIds(Integer itemId, ArrayList<Integer> resultIds) {
        List<Integer> subItemIds = itemMapper.getSubItemIds(itemId);
        if (subItemIds != null && subItemIds.size() > 0) {
            resultIds.addAll(subItemIds);
            for (Integer subItemId : subItemIds) {
                getSubItemIds(subItemId, resultIds);
            }
        }
        return resultIds;
    }
}
```