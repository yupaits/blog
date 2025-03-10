1. 使用局部的 filter 代替 methods 中的方法格式化数据显示。

2. vue 在绑定 date 类型的 input 输入框时，设置默认值要用 `:value="date | toDate"`，toDate 为过滤器；当 date 的值是 timestamp 类型时，toDate 可以为以下方法：
    ```javascript
    function dateTime(date) {
        if (date) {
            date = new Date(date);
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            return date.getFullYear() + '-' + 
                (month < 10 ? '0' + month : month) + '-' + 
                (day < 10 ? '0' + day : day) + ' ' + 
                (hour < 10 ? '0' + hour : hour) + ':' + 
                (minute < 10 ? '0' + minute : minute) + ':' + 
                (second < 10 ? '0' + second : second);
        }
        return date;
    }
    ```

3. vue.js 2.5.2版本在 v-for 循环中使用 v-model 绑定数组元素时会报如下错误：
    ```jsx
    You are binding v-model directly to a v-for iteration alias. This will not be able to modify the v-for source array because writing to the alias is like modifying a function local variable. Consider using an array of objects and use v-model on an object property instead.
    ```
    从提示信息可以看出 vue 建议使用 array 的某个元素的属性值作为 v-model 绑定的主体，如果元素并不是 Object 类型而是 String 类型时，需要通过 index 来实现元素绑定。具体代码如下：
    ```vue
    <div v-for="(el, index)  in array">
        <input type="text" v-model="array[index]">
    </div>
    ```

4. 将数组中位于 index1 的元素移动至 index2 的位置：
    ```javascript
    list.splice(index2, 0, list.splice(index1, 1)[0]);
    ```
    交换数组中位于 index1 和 index2 的两个元素：
    ```javascript
    list[index1] = list.splice(index2, 1, list[index1])[0];
    ```
    vue 组件中实时交换位于 index1 和 index2 的两个元素：
    ```javascript
    this.$set(list, index1, list.splice(index2, 1, list[index1])[0]);
    ```

5. Vue的 `filters` 块中的过滤器不能加载自身 `data()` 块中的变量，如果需要使用 `data()` 中的变量对数据进行转换时可以将过滤器的逻辑写在 `methods` 块中。

6. 在使用基于Vue的前端框架进行开发时，有些框架组件无法对点击事件进行监听和处理（如 `ant-design-vue` 的 `popconfirm` 组件，详见 [Could you add a property in PopConfirm to stop click event propagation?](https://github.com/ant-design/ant-design/issues/7233)），而如果此时正好需要阻止某个组件的点击事件向上层元素传播时，可以使用如下方式：
    ```jsx
    <div @click="e => e.stopPropagation()">
      <a-popconfirm></a-popconfirm>
    </div>
    ```

7. Vue的 `style scoped` 中的样式不起作用时，可以新增一个无scoped修饰的 `style` 来定义css样式，例如：
    ```css
    <style scoped>
    .scoped-style {
      background-color: black;
    }
    </style>

    <style>
    .global-style {
      color: white;
    }
    </style>
    ```

8. 在Vue中使用JSX语法时，需要注意以下方面：
    - 所有的运算赋值操作都需要在 `{}` 中，如获取变量值，调用方法等。
    - 不支持Vue的过滤器，需要使用方法来代替。
    - 事件监听 `@click="handleClick(param)"` => `onClick={this.handleClick.bind(this, param)}`，`@click.native="handleNativeClick(param)"` => `nativeOnClick={this.handleNativeClick.bind(this, param)}`，这里需要使用js原生的`bind`方法来进行方法调用。
    - 不支持Vue的指令，常用的指令的备选解决方案：`v-if="condition"` => `v-show="condition"` 或者 `{condition ? <div>JSX</div> : ''}`；`<li v-for="item in items" :key="item">{item}</li>` => `{items.map((item, index) => {return <li>{item}</li>})}`。

9. win7系统在安装高版本node.js（v14.x.x）时，会提示“仅支持更高的win8、win10系统”。但是node.js的生态里，很多新技术必须安装高版本node.js环境才能正常使用和开发（如electron的最新版本要求node.js版本不低于v14.x.x）。可以通过以下方式解决：
    - 下载[nvm（node.js版本管理器）](https://github.com/nvm-sh/nvm)并安装
    - 安装完成后，使用`nvm list available`查看可安装的node.js版本
    - 选择最新的`CURRENT`版本或者`LTS`版本进行安装，安装完成后使用`nvm use 14`切换至高版本node.js即可正常使用
