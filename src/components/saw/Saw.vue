<template>
    <div>
        <SawList></SawList> 
            
    </div>
</template>
<script>
 import Vue from 'vue';
    import { mapGetters, mapState, mapActions} from 'vuex'
    import SawList from './SawList.vue'
    export default 
    {   components: { 'SawList': SawList, },
    created(){  
   
    }
    }

</script>
<style>

</style>