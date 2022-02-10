<template> 
  <v-data-table :headers="headers" :items="stateNodes3"   class="elevation-1" 
       :footer-props="{showFirstLastPage: true, itemsPerPageOptions: [10,20,40,-1], }">

   <template v-slot:top>
        <v-toolbar color="light-blue darken-3" dark dense>
          <v-toolbar-title>PIECE LIST</v-toolbar-title>
          <v-divider class="mx-4" inset vertical ></v-divider>
         
          <v-toolbar-title>JOB - {{selectedJob.Order_Number}}</v-toolbar-title>
        </v-toolbar>
    </template> 
 <template v-slot:item.action="{ item }">
     <v-btn ripple small v-if="item.Status_id =='7'"  color="teal" rounded dark :loading="loading"  @click.prevent="pcutchangestatus(item)">{{item.Status}}</v-btn>
       <v-btn ripple small v-else color="light-blue darken-1" rounded dark :loading="loading"   @click.prevent="pcutchangestatus(item)">{{item.Status}}</v-btn>
    </template>

  </v-data-table>
</template>
 
<script>
import { mapGetters, mapState, mapActions} from 'vuex';
  export default 
  {   data: () => (
        { dialog: false,loading:false,
          headers: [
             // { text: 'S.No', align: 'left', sortable: false, value: 'SNO',},
              { text: 'Extrusion', value: 'Length',sortable: false },
              { text: 'Item', value: 'Item' ,sortable: false},
              { text: 'Machine', value: 'Machine' ,sortable: false},
              { text: 'Status', value: 'action', sortable: false },

            ],
            formSearchData: {  SawCode:'', QuoteID:'',}, 
                           formData: {    ID:'', QuoteID:'',   title: '',  SawCode:'',status:'',location:'',jid:'' },
        }),

    computed: 
      {  ...mapState({   stateNodes2: state => state.saw.profilecutting[0],
                            selectedJob: state => state.saw.selectedJob,
                            selectedJobDetail: state => state.saw.selectedJobDetail,
                            selectedSaw: state => state.saw.selectedSaw,
                            jobdetails1: state => state.saw.jobdetails,
                            joblist: state => state.saw.joblist,
                            flaggedjob:state => state.saw.flaggedjob,
                             user: state => state.auth.user,
                    }),
                    stateNodes3() 
                    {   return this.stateNodes2.slice().sort(function(a, b) {    return a.Length - b.Length;  });
                            }
      },
    methods: 
          {              
              pcutchangestatus( data)
              { //-----------view only user-------
                if(this.user.admin =='3')
                            {  
                              swal.fire({ position: 'top-right',
                                                title:'<span style="color:white">Access denied: View only user</span>',
                                                timer: 2000, toast: true, background: 'red',
                                                });
                                                
                              return;
                            }
//------------------------------  
               
                  //---for cut status
                 /* if(this.flaggedjob)
                    {  if(this.flaggedjob.quote_ID==this.selectedJob.quote_ID
                        && this.flaggedjob.order_ID==this.selectedJob.Order_Number
                        && this.flaggedjob.cut_saw==this.selectedJob.cut_saw
                        && this.flaggedjob.review>0 && this.flaggedjob.review != 9 
                        && this.flaggedjob.review !=6)
                        {
                            swal.fire({ position: 'top-right',
                                title:'<span style="color:white">Flagged Jobs can not be cut, please UnFlag it</span>',
                                    timer: 2000, toast: true,background: 'purple',
                                    });
                                return;
                            }
                    }
                    else if(this.selectedJob.review>0 && this.selectedJob.review != 9 && this.selectedJob.review !=6 )
                      {  
                            swal.fire({ position: 'top-right',
                                title:'<span style="color:white">Flagged Jobs can not be cut, please UnFlag it</span>',
                                    timer: 2000, toast: true,background: 'purple',
                                    });
                                return;
                      }  */
                      this.formData.ID= data.ID;
                      this.formData.SawCode=this.selectedSaw;
                      this.formData.status=data.Status_id;
                      this.formData.QuoteID=this.selectedJob.quote_ID;
                      this.formData.extn_id=this.selectedJobDetail.extn_id;
                      this.formData.jid = this.selectedJob.id;
                      this.formData.fincol=this.selectedJobDetail.FincolID;
                      
                      //--------------------------
                      this.loading=true;
                     
                      this.$store.dispatch('updateprofilecut', this.formData)
                            .then((response) =>  { this.loading=false;
                                })     
                            .catch((error) => {    this.loading=false;     });
                      this.resetFormData();
              },
              resetFormData() {  this.formData = {  ID: '', status:'',SawCode:'', Location:'',QuoteID:'', jid:'' }; },
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
</style>