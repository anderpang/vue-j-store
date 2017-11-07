# vue-j-store

vue2.X 模块化状态管理，解决store文件过大，命名空间过长等问题。其实只是一种思路。

用法尽可能与vuex保存一致，（注意）其中对map方法进行了扩展，调用方式也不一样。

## npm

```bash

$ npm install vue-j-store

```

## 优点对照

![vue-j-store](https://raw.githubusercontent.com/anderpang/vue-j-store/master/images/vue-j-store.jpg)

相信用过的人都想过store过大，actions过多而头痛吧。换个角度不好吗？一对一，删除方便，查找方便，读取变量也方便。

## Usage

#### main.js
```javascript
  import Vue from "vue";
  import VueStore from "vue-j-store";

  Vue.use(VueStore);
```

#### componentA
componentA/store.js
```javascript
  import VueStore from "vue-j-store";

  export default new VueStore({
    state:{
      count:0
    },
    mutations:{
      inc(state){
         state.count++;
      },
      reduce(state){
        state.count--;
      }
    }
  });

```
componentA/index.vue
```javascript
<template>
  <div>
    <h4>{{$store.state.count}}</h4>
    <button @click="$store.commit('inc')">加</button>
    <button @click="$store.commit('reduce')">减</button>
  </div>
</template>

<script>
  import store from "./store";
  export default {
    store
  }
</script>
```

#### componentB

componentB/store.js
```javascript
  import VueStore from "vue-j-store";

  export default new VueStore({
    state:{
      count:0
    },
    mutations:{
      inc(state,len){
         state.count+=len;
      },
      reduce(state){
        state.count--;
      }
    },
    actions:{      
      ajaxRequest(context){
          console.log("请求数据中...");

          fetch("http://gank.io/api/data/Android/10/1").then(function(res){
            return res.json();
          }).then(function(json){
             context.commit("inc",json.results.length);
             console.log("操作完毕！");
          });
      }
    }
  });

```
componentB/index.vue
```javascript
<template>
  <div>
    <h4>{{count}}</h4>
    <button @click="ajaxRequest">请求</button>
  </div>
</template>

<script>
  import store from "./store";
  export default {
    computed:{          
        count(){
            return this.$store.state.count;
        }
    },
    methods:store.mapActions(),
    store
  }
</script>
```

## map使用惯例
```javascript
   store.mapState();   //全部
   store.mapState("count");   //等同于["count"]
   store.mapState(["count"]);
   
   store.mapSetters();   //同上
   ...
   ...

   store.mapMutations(); //同上
   ...
   ...

   store.mapActions();   //同上
   ...
   ...
```