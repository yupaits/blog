1. Go语言中没有`try-finally`这样的处理机制，但通过`立即执行的匿名函数` + `defer`的组合，可以实现类似的效果。
    
    ```go {4-11}
    func main() {
        ...
    
        func() {
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