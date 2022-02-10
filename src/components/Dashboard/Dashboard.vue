<template>
    <div>
        <SawList></SawList> 
            
    </div>
</template>
<script>
 import Vue from 'vue';
    import { mapGetters, mapState, mapActions} from 'vuex'
    import SawList from '../saw/SawList.vue'
    export default 
    {   components: { 'SawList': SawList, },
        created(){  this.$store.dispatch('getsaws')
            this.$store.dispatch('getsawflags')
            this.$store.dispatch('getsawstatus')
            this.$store.dispatch('getusers')
            this.$store.dispatch('getsawprint')
   }
    }

</script>
<style>

</style>