<template>
    <div>
        <UserList></UserList> 
            
    </div>
</template>
<script>
 import Vue from 'vue';
    import { mapGetters, mapState, mapActions} from 'vuex'
    import UserList from './userlist.vue'
    export default 
    {   components: { 'UserList': UserList, },
    created(){  this.$store.dispatch('getusers')}

    }

</script>
<style>

</style>