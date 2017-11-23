var _Vue;

function VueStore(opts){
    var state=opts.state,
        getters={},
        _watch=this._watch,
        dp,
        oGetters,
        k;

    this.state=state?typeof state==="function"?state():typeof state==="object"?state:{}:{};

    //actions
    this.actions=opts.actions||{};

    //mutations
    this.mutations=opts.mutations||{};

    //getters
     oGetters=opts.getters;

     if(oGetters){
        dp=Object.defineProperty;
        for(k in oGetters){
           dp(getters,k,{
               enumerable: true,
               get:_watch.bind(this,k)
           });
        }
     }

    this._vm = new _Vue({
        data: {
          $$state: this.state
        },
        methods: oGetters
    });

    this.getters=getters;  
}

VueStore.install=function(Vue){
     if(_Vue)return;
     _Vue=Vue;
     Vue.mixin({ beforeCreate: function(){
         var options = this.$options;
         options.store&&(this.$store=options.store);
     }});
};

VueStore.prototype={
    constructor:VueStore,

    commit:function(type,payload){
       var mutation=this.mutations[type];
       mutation&&mutation(this.state,payload); 
    },
    dispatch:function(type,payload){
        var action=this._getAction(type,payload);
        type=action.type;
        if(type){
           payload=action.payload;
           action=this.actions[type];
           action&&action(this,payload);
        }
    },
    _getAction:function(type,payload){
        var action={};
        if(typeof type==="string"){
           action.type=type;
           action.payload=payload;
        }
        else
        {
            action.type=type.type;
            action.playload=type;
        }
        return action;
    },
    _watch:function(k){
       return this._vm[k](this.state,this.getters);
    },
    _mapSerialize:function(map){
        var r,tf=typeof map;
        switch(tf){
            case "object":
                if(Array.isArray(map)){
                    r={};
                    map.forEach(function(m){
                        r[m]=m;
                    });         
                    return r;
                }
                return map;
            case "string":
                r={};
                r[map]=map;
               return r;
            default:
              return null;
        }
    },
    _toMap:function(map){
       var r={},keys=Object.keys(map),i=keys.length,key;
       while(i--){
           key=keys[i];
           r[key]=key;
       }
       return r;
    },
    mapState:function(states){
       var r={},k,f=function(v){           
           return function(){
              var store=this.$store;
              return typeof v==="function"?v.call(this,store.state,store.getters):store.state[v];
           };
       };
       states=this._mapSerialize(states)||this.state;
       for(k in states){
          r[k]=f(states[k]);
       }
       return r;
    },
    mapGetters:function(getters){
       var r={},k,f=function(v){
           return function(){
               return this.getters[v];
           }
       };
       getters=this._mapSerialize(getters)||this.getters;
       for(k in getters){
          r[k]=f(getters[k]);
       }
       return r;
    },
    mapMutations:function(mutations){
       var r={},k,f=function(v){
           return function(){
               var store=this.$store,
                   commit=store.commit,
                   args=[].slice.call(arguments);
               return typeof v==="function"?v.apply(this,[commit].concat(args)):commit.apply(store, [v].concat(args));
           }
       };
       mutations=this._mapSerialize(mutations)||this._toMap(this.mutations);
       for(k in mutations){
          r[k]=f(mutations[k]);
       }
       return r;       
    },
    mapActions:function(actions){
       var r={},k,f=function(v){
           return function(){
               var store=this.$store,
                   dispatch=store.dispatch,
                   args=[].slice.call(arguments);

               return typeof v==="function"?v.apply(this,[dispatch].concat(args)):dispatch.apply(store, [v].concat(args));
           }
       };
       actions=this._mapSerialize(actions)||this._toMap(this.actions);

       for(k in actions){
          r[k]=f(actions[k]);
       }
       return r;       
    }
};

export default VueStore;
