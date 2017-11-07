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
    }
};

export default VueStore;