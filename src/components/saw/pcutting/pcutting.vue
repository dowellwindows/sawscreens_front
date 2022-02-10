<template>
 <v-container grid-list-lg pa-0 mt-2>
    <v-layout wrap>
       <v-flex xs12>
         <v-btn  text  color="grey" @click="backToJobdetails">
            <v-icon id="return-btn">mdi-keyboard-backspace</v-icon>RETURN TO JOBDETAILS
         </v-btn>

        <v-btn id="flag-btn" ripple small color="blue darken-4"  rounded dark   :loading="loading1"
                  @click.prevent="extToSaw"><v-icon  >mdi-share-circle</v-icon>Ext-To-Saw</v-btn>
        <v-btn id="flag-btn" ripple small color="green accent-4"  rounded dark  :loading="loading2" 
                  @click.prevent="reOptimise"><v-icon  >mdi-cog-clockwise</v-icon>Re-Optimise</v-btn>
       </v-flex>
   <v-flex md6 pt-0>
         <profile-information ></profile-information> <br/>
         <opt-cut ></opt-cut> 
    </v-flex> 
       <v-flex md6>
         <profile-cutting-list ></profile-cutting-list> 
    </v-flex> 

  </v-layout>
 </v-container>
</template>
<script>
 import pcuttinglist from './pcuttinglist.vue'
  import pinformation from './pinformation.vue'
    import optcut from './optcut.vue'
       import Vue from 'vue'
    import { mapGetters, mapState} from 'vuex'
export default {
        components: { 
        'profile-cutting-list': pcuttinglist, 
        'profile-information': pinformation, 
        'opt-cut': optcut, 
         },
         computed: 
        { ...mapGetters({    }),
          ...mapState({ stateNode: state => state.saw.profilecutting[0],
                        selectedJob: state => state.saw.selectedJob,
                        selectedSaw: state => state.saw.selectedSaw,
                        stateNodes3: state => state.saw.jobdetails,
                        selectedJobDetail: state => state.saw.selectedJobDetail,
                         user: state => state.auth.user,
                  }),
         },
       data () {  return { loading1: false , loading2: false ,  formSearchData: { SawCode: '',  QuoteID: '',  extn_id: '',  loc:'',       }}} ,
       methods: {   backToJobdetails() 
                     {     this.formSearchData.SawCode = this.selectedSaw;
                           this.formSearchData.QuoteID = this.selectedJob.quote_ID;
                           this.$store.dispatch('getjobdetails', this.formSearchData)
                           .then((response) => 
                              {   
                                 this.$router.push({   name: 'jobdetails' });
                              })
                           .catch((error) => {});
         
         //this.$router.push({name: 'jobdetails'});  
         },
         extToSaw() {
            //-----------view only user-------
                if(this.user.admin =='3')
                            {  
                              swal.fire({ position: 'top-right',
                                                title:'<span style="color:white">Access denied: View only user</span>',
                                                timer: 2000, toast: true, background: 'red',
                                                });
                                                
                              return;
                            }
//------------------------------
                  this.formSearchData.QuoteID = this.selectedJob.quote_ID;
                  this.formSearchData.SawCode = this.selectedSaw;
                  this.formSearchData.loc = "GBG";
                 
                  this.formSearchData.extn_id=this.selectedJobDetail.extn_id;
                 
                  this.loading1=true;
                  this.$store.dispatch('extToSawCut', this.formSearchData)
                  .then((response) =>  {  this.loading1=false; })     
                  .catch((error) => {    this.loading1=false;      });
               },
         reOptimise() { 
            //-----------view only user-------
                if(this.user.admin =='3')
                            {  
                              swal.fire({ position: 'top-right',
                                                title:'<span style="color:white">Access denied: View only user</span>',
                                                timer: 2000, toast: true, background: 'red',
                                                });
                                                
                              return;
                            }
//------------------------------
            this.loading2=true;
               this.formSearchData.QuoteID = this.selectedJob.quote_ID;
               this.formSearchData.SawCode = this.selectedSaw;
               this.formSearchData.loc = "GBG";
               this.formSearchData.extn_id=this.selectedJobDetail.extn_id;
                this.loading2=true;
               this.$store.dispatch('reOptimiseCut', this.formSearchData)
               .then((response) =>  {  this.loading2=false; })     
                  .catch((error) => {    this.loading2=false;      });
            },
            
           //------------------------------ 
            },
    
}
</script>
<style scoped>
#flag-btn{margin-left:10px; }
</style>