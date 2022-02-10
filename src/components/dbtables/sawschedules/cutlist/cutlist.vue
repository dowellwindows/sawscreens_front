<template>
 <v-container grid-list-lg pa-0 mt-2>
    <v-layout wrap>
       <v-flex xs12>
         <v-btn  text  color="grey" @click="backToSaw">
            <v-icon id="return-btn">mdi-keyboard-backspace</v-icon>RETURN TO SAWSCHEDULES
         </v-btn> 
       </v-flex>
    <v-flex xs12 pt-0>
         <test-list-view :data='data'></test-list-view>
    </v-flex>
  </v-layout>
 </v-container>
</template>
<script>
import {  mapState} from 'vuex'
 import TestListView from './cutlistlist.vue'
export default {
        components: { 
        'test-list-view': TestListView,  },
         props: ['data'],
      // data () {  return { loading1: false , loading2: false ,  formSearchData: { SawCode: '',  QuoteID: '',  extn_id: '',  loc:'',       }}} ,
       methods: {   backToSaw() { //this.$router.push({name: 'jobdetails'});  
                             
                                 this.$router.push({   name: 'sawschedules' });
                             
                           },
            },
    
}
</script>
<style scoped>
.disable-events {
  pointer-events: none
}
</style>