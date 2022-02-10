<template> 
  <v-data-table :headers="headers" :items="jobdetailslist"   class="elevation-1" 
       :footer-props="{showFirstLastPage: true, itemsPerPageOptions: [10,20,40,-1], }">

   <template v-slot:top>
        <v-toolbar  color="light-blue darken-3" dark dense>
          <v-toolbar-title>BARS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical ></v-divider>
         
          <v-toolbar-title>SAW - {{selectedSaw.replace(/_/g, " ")}}  
               <v-divider class="mx-4" inset vertical ></v-divider>
            Order Number - {{selectedJob.Order_Number}}
            <v-divider class="mx-4" inset vertical ></v-divider>
<!----->
 <v-tooltip bottom :disabled="selectedJob.comments==null">
   <template v-slot:activator="{ on }">
            <v-btn v-on="on"  v-if="showflag1" small  rounded dark color="pink" 
                 ><v-icon >mdi-flag-outline</v-icon>Flagged Job</v-btn> 
    </template>
    <span v-if="selectedJob.comments !=null">{{cmt1.val}}</span>
    <span :disabled="selectedJob.comments ==null" ></span>
  </v-tooltip> <!--<span v-if="showflag1" class="ml-1"> {{cmt1.val}} </span>-->
   <!----->
</v-toolbar-title>

        </v-toolbar>
    </template> 
 <template v-slot:item.action="{ item }"><!--1=qd,2-inpr,3-complt----->
     
       <v-btn ripple small  v-if="item.Status_id =='2'" :loading="loading" color="red accent-2" rounded dark   @click.prevent="chstatus(item)">{{item.Status}}</v-btn>
       <v-btn ripple small v-else-if="item.Status_id =='3'" :loading="loading" color="teal" rounded dark   @click.prevent="chstatus(item)">{{item.Status}}</v-btn>
       <v-btn ripple small v-else color="light-blue darken-1" :loading="loading" rounded dark    @click.prevent="chstatus(item)">{{item.Status}}</v-btn>
    </template>
  </v-data-table>
</template>
 
<script>
import { mapGetters, mapState, mapActions} from 'vuex';
  export default 
  {  

    computed: 
      {  ...mapState({ sawlist: state => state.saw.sawlist, 
                        jobdetailslist:state =>state.saw.jobdetailslist,
                        selectedSaw: state => state.saw.selectedSaw,
                        selectedJob: state => state.saw.selectedJob,
                        flaggedjob:state => state.saw.flaggedjob
                    }),
                    cmt1(){
                                if(this.flaggedjob && this.flaggedjob.quote_ID==this.selectedJob.quote_ID
                                  && this.flaggedjob.order_ID==this.selectedJob.Order_Number
                                  && this.flaggedjob.cut_saw==this.selectedJob.cut_saw )
                              {    
                                      this.cmt.val=this.flaggedjob.comments
                                     
                                          return this.cmt ;
                                  
                              }
                              else if(this.selectedJob.comments !='')   
                             // if(this.selectedJob.comments !='') 
                              {
                                  this.cmt.val=this.selectedJob.comments
                                  
                                          return this.cmt ;
                              }
                              else{
                                  this.cmt.val='';
                              }
                    },
          showflag1(){
           
            if(this.flaggedjob && this.flaggedjob.quote_ID==this.selectedJob.quote_ID
                && this.flaggedjob.order_ID==this.selectedJob.Order_Number
                && this.flaggedjob.cut_saw==this.selectedJob.cut_saw
                && this.flaggedjob.review>0 && this.flaggedjob.review != 9 
                && this.flaggedjob.review !=6)
                  {     this.showflag=true;
                        
                          return this.showflag;
                        
                  }
                else if(this.selectedJob.review>0 && this.selectedJob.review != 9 && this.selectedJob.review !=6 )
                {  this.showflag=true;
                  
                  return this.showflag;

                }
                else return;
          }
      },
      created () {  },
       data: () => (
        { dialog: false,
          headers: [
              { text: 'S.No', align: 'left', sortable: false, value: 'SNO',},
              { text: 'Extrusion', value: 'Extrusion',sortable: false },
              { text: 'Description', value: 'Description' ,sortable: false},
              { text: 'Colour', value: 'Color',sortable: false },
              { text: 'Pieces', value: 'Pieces', sortable: false},
              { text: 'Bars', value: 'Bars', sortable: false },
              { text: 'Clamps', value: 'clamp_pos', sortable: false },
              { text: 'Status', value: 'action', sortable: false },
            ],
            formSearchData: {  SawCode: '', QuoteID: '', extn_id: '', loc:''  }, loading:false,
            showflag:false, cmt:{val:''},
        }),
   
    mounted() {    
              },
    methods: 
    { showcmt(){ 
    
      },  
      chstatus(data)
          {  
              if(this.selectedJob.cut_saw != null) 
              {this.formSearchData.SawCode = this.selectedJob.cut_saw;}
              else this.formSearchData.SawCode = this.selectedSaw ;
              this.formSearchData.QuoteID = this.selectedJob.quote_ID;
              this.formSearchData.extn_id = data.extn_id;
              this.formSearchData.fincol = data.FincolID;
             
              this.loading=true;
              this.$store.dispatch('selectedJobDetail', data);
              this.$store.dispatch('getprofilecutting', this.formSearchData)
                  .then((response) => { this.loading=false;
                   
                      this.$router.push({
                          name: 'profilecutting'
                      });
                  })
                  .catch((error) => {});
                      
           },
      


    },
  }
</script>
<style scoped>

.theme--light.v-data-table tbody td {
    font-size: 20px !important;
}
.v-data-table td{
   font-size: 10px;
}
.disable-events {
  pointer-events: none
}
</style>