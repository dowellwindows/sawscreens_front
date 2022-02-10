<template> 
  <v-data-table :headers="headers" :items="stateNodes3"   class="elevation-1" 
       hide-default-footer>
     <template v-slot:top>
        <v-toolbar color="light-blue darken-3" dark dense>
          <v-toolbar-title>OPTIMISER CUTS</v-toolbar-title>
        <!--  <v-divider class="mx-4" inset vertical ></v-divider>
         
          <v-toolbar-title>QT ID - {{selectedJob.quote_ID}} | EXT_ID - {{selectedJobDetail.extn_id}}</v-toolbar-title>
        -->
        </v-toolbar>
    </template> 
 <template v-slot:item.action="{ item }">
      <v-btn ripple small v-if="item.grp_status =='7'" :loading="loading" color="teal" rounded dark   @click.prevent="onClickSChange(item)">Completed</v-btn>
       <v-btn ripple small v-else-if="item.grp_status =='5'" :loading="loading" color="light-blue darken-1" rounded dark   @click.prevent="onClickSChange(item)">Queued</v-btn>
        <v-btn ripple small v-else :loading="loading" color="light-blue darken-1" rounded dark  @click.prevent="onClickSChange(item)">Queued</v-btn>
    </template>

  </v-data-table>
</template>
 
<script>
import { mapGetters, mapState, mapActions} from 'vuex';
  export default 
  {   data: () => (
        { dialog: false,
          headers: [
              { text: 'S.No', align: 'left', sortable: false, value: 'opt_cut',},
              { text: 'Status', value: 'action', sortable: false },

            ],
            seen: true , loading:false,
            formData: {    ID:'', name: '',  QuoteID:'',  title: '',   qt_id: '',SawCode:'',status:'',location:'', extn_id:'' },
        }),

    computed: 
      {  ...mapState({  stateNodes3: state => state.saw.profilecutting[1],
                            selectedJob: state => state.saw.selectedJob,
                            selectedJobDetail: state => state.saw.selectedJobDetail,
                            selectedSaw: state => state.saw.selectedSaw,
                            jobdetails1: state => state.saw.jobdetails,
                            joblist: state => state.saw.joblist,
                            optcutlist: state => state.saw.optcutlist,
                            flaggedjob:state => state.saw.flaggedjob,
                             user: state => state.auth.user,
                    }),
                   
      },
    watch: {   },
    created () {  },
    mounted() {    
              },
    methods: 
          {   onClickSChange(data)
              {
                if(this.user.admin =='3')
                            {  
                              swal.fire({ position: 'top-right',
                                                title:'<span style="color:white">Access denied: View only user</span>',
                                                timer: 2000, toast: true, background: 'red',
                                                });
                                                
                              return;
                            }
//------------------------------  
               
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
                      }*/
                      this.formData.ID= data.bar_guid;
                      this.formData.SawCode=this.selectedSaw;
                      this.formData.status=data.grp_status;
                      this.formData.qt_id=this.selectedJob.quote_ID;
                      this.formData.QuoteID=this.selectedJob.quote_ID;
                      this.formData.extn_id=this.selectedJobDetail.extn_id;
                      this.formData.fincol=this.selectedJobDetail.FincolID;
                      //--------------------------
                     
                      this.loading=true;
                      this.$store.dispatch('updateOptCut', this.formData)
                            .then((response) =>  {this.loading=false;  })     
                            .catch((error) => {     this.loading=false;    });
                      this.resetFormData();
              },
              resetFormData() {  this.formData = {  ID: '', status:'',SawCode:'', Location:'', qt_id:'',extn_id:''  }; },
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