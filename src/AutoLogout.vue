<template>
  <div></div>
</template>

<script>
  import { mapGetters, mapState, mapActions} from 'vuex'
export default {
    computed:{
        ...mapGetters({authenticated:'auth/authenticated',
                       user:'auth/user'
                      }),
          
    },
data(){
    return{
        events:['click','mouseover','scroll','keypress','load'],
        warningTimer:null,logoutTimer:null
    }
},
mounted(){

    if(this.user!=null && this.authenticated !=null)
    {
        this.setTimers(); 
    }
},
destroyed(){
  
        this.events.forEach(function(event)
            { window.removeEventListener(event,this.resetTimer);
            },this);
        this.resetTimer(); 
   

},
methods:{
            ...mapActions({signOut1:'auth/signOut'}),
        signOut(){
        if(this.user!=null && this.authenticated !=null)
        {
                    this.signOut1().then(()=>{
                        this.$router.replace({path:'/login'})
                    })
            }
        },
    setTimers(){ 
      
       if(this.user!=null && this.authenticated !=null){
        this.logoutTimer=setTimeout(this.signOut, 10*60*60*1000) } 
        },
    warningMessage:function(){alert('warning')},

    resetTimer(){
        clearTimeout(this.logoutTimer); 
        this.setTimers();
    },
    //logout:function(){ document.getElementById('sign-out').click();    }
}

    }

</script>

<style>

</style>