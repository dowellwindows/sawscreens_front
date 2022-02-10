<template>
 <v-container grid-list-lg pa-0 mt-2>
    <v-layout wrap>
       <v-flex xs12>
         <v-btn  text  color="grey" @click="backToSaw">
            <v-icon id="return-btn">mdi-keyboard-backspace</v-icon>RETURN TO JOBDETAILS
         </v-btn>
       </v-flex>
    <v-flex xs12 pt-0>
         <test-list-view ></test-list-view>
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
        computed: 
        { 
          ...mapState({ 
                        selectedJob: state => state.saw.selectedJob,
                        selectedSaw: state => state.saw.selectedSaw,
                        joblist:state =>state.saw.joblist,
                        user: state => state.auth.user,
                        
                  }),
         },
       data () {  return { loading1: false , loading2: false ,  formSearchData: { SawCode: '',  QuoteID: '',  extn_id: '',  loc:'',       }}} ,
       methods: {   backToSaw() { //this.$router.push({name: 'jobdetails'});  
                            this.formSearchData.SawCode = this.selectedSaw;
                           this.formSearchData.QuoteID = this.selectedJob.quote_ID;
                           this.$store.dispatch('getjobdetails', this.formSearchData)
                           .then((response) => 
                              { 
                                 this.$router.push({   name: 'jobdetails' });
                              })
                           .catch((error) => {});
                           },
            },
    
}
</script>
<style scoped>
#return-btn{

}
</style>