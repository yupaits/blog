1. Go语言中没有`try-finally`这样的处理机制，但通过`立即执行的匿名函数` + `defer`的组合，可以实现类似的效果。
    
    ```go {4,5,7,11}
    func main() {
        ...
    
        func() { // [!code focus:8]
            defer func() {
                // finally代码
            }()
       
            // try代码，业务逻辑
            ...
        }()
    
        ...
    }
    ```
    - 为什么没有`catch`？因为Go语言推荐显式处理`error`；至于`panic`，使用`defer` + `recover`的组合正常捕获处理即可。
    - 为什么使用匿名函数？是为了控制只在匿名函数的内部，`finally`代码一定会执行。

2. `goroutine`内`panic`导致程序崩溃如何处理？如果不需要异步执行带参数的函数，推荐使用封装的`SafeGo`安全启动`goroutine`，自动捕获`panic`。

    ```go
    // SafeGo 安全启动goroutine
    func SafeGo(fn func()) {
        go func() {
            defer func() {
                if r := recover(); r != nil {
                    slog.Error(fmt.Sprintf("[panic]异步任务执行出错: %v\n堆栈信息:\n%s", r, debug.Stack()))
                }
            }()
            fn()
        }()
    }
    ```

3. 获取指定日期的开始时间、中午、结束时间工具函数：

    ```go
    // AtStartOfDay 返回指定日期开始的时间 00:00
    func AtStartOfDay(date time.Time) time.Time {
        return time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
    }
   
    // AtEndOfDay 返回指定日期结束的时间 23:59:59.999999999
    func AtEndOfDay(date time.Time) time.Time {
        return AtStartOfDay(date).Add(24 * time.Hour).Add(-time.Nanosecond)
    }
   
    // AtNoon 返回指定日期中午的时间 12:00
    func AtNoon(date time.Time) time.Time {
        return AtStartOfDay(date).Add(12 * time.Hour)
    }
    ```

4. 实现双向映射`BiMap`：

    ```go
    // BiMap 双向映射Map
    type BiMap[K comparable, V comparable] struct {
       kv map[K]V
       vk map[V]K
    }
    
    func NewBiMap[K comparable, V comparable]() *BiMap[K, V] {
       return &BiMap[K, V]{
           kv: make(map[K]V),
           vk: make(map[V]K),
       }
    }
    
    func (b *BiMap[K, V]) Put(key K, val V) {
       // 检查并清理旧的映射关系
       if oldVal, ok := b.kv[key]; ok {
           delete(b.vk, oldVal)
       }
       if oldKey, ok := b.vk[val]; ok {
           delete(b.kv, oldKey)
       }
       b.kv[key] = val
       b.vk[val] = key
    }
    
    func (b *BiMap[K, V]) GetValue(key K) (V, bool) {
       val, ok := b.kv[key]
       return val, ok
    }
    
    func (b *BiMap[K, V]) GetKey(val V) (K, bool) {
       key, ok := b.vk[val]
       return key, ok
    }
    
    func (b *BiMap[K, V]) DeleteByKey(key K) {
       if val, ok := b.kv[key]; ok {
           delete(b.kv, key)
           delete(b.vk, val)
       }
    }
    
    func (b *BiMap[K, V]) DeleteByValue(val V) {
       if key, ok := b.vk[val]; ok {
           delete(b.vk, val)
           delete(b.kv, key)
       }
    }
    ```

5. 判断Context的类型：

    ```go
    // IsBackground 判断Context是否是context.Background()
    func IsBackground(ctx context.Context) bool {
        return fmt.Sprintf("%v", ctx) == "context.Background"
    }
    
    // IsTODO 判断Context是否是context.TODO()
    func IsTODO(ctx context.Context) bool {
        return fmt.Sprintf("%v", ctx) == "context.TODO"
    }
    
    // IsRootContext 判断Context是否是根Context
    func IsRootContext(ctx context.Context) bool {
        s := fmt.Sprintf("%v", ctx)
        return s == "context.Background" || s == "context.TODO"
    }
    ```