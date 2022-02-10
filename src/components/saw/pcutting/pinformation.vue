<template> 
<v-simple-table light class="elevation-1">
     <template v-slot:top>
        <v-toolbar color="light-blue darken-3" dark dense>
          <v-toolbar-title>CUTS INFO</v-toolbar-title>
          <v-divider class="mx-4" inset vertical ></v-divider>
          <v-toolbar-title class="mx-4">SAW - {{selectedSaw.replace(/_/g, " ")}}</v-toolbar-title>
          <v-btn v-if="showflag1" small  rounded dark color="pink" class="disable-events"
          ><v-icon  >mdi-flag-outline</v-icon>Flagged</v-btn>
        </v-toolbar>
    </template> 
    <template v-slot:default>
      <thead>
        <tr>
          <th class="text-left">Extrusion</th>
          <th class="text-left">Description</th>
            <th class="text-left">Color</th>
          <th class="text-left">Stock Length</th>
            <th class="text-left">Bars</th>
          <th class="text-left">Pieces</th>
        </tr>
      </thead>
<tbody>
            <tr>
                <td>{{ stateNode[0].Extrusion }}</td>
                <td>{{ stateNode[0].Description }}</td>
                <td>{{ stateNode[0].Color }}</td>
                <td>{{ stateNode[0].Stock_Length }}</td>
                <td>{{ selectedJobDetail.Bars }}</td>
                <td>{{ selectedJobDetail.Pieces }}</td>
            </tr>
        </tbody>
    </template>
  </v-simple-table>
</template>
 
<script>
import { mapGetters, mapState, mapActions} from 'vuex';
  export default 
  {   data: () => (
        { dialog: false,
          headers: [
              { text: 'S.No', align: 'left', sortable: false, value: 'Extrusion',},
              { text: 'Extrusion', value: 'Description',sortable: false },
              { text: 'Description', value: 'Color' ,sortable: false},
              { text: 'Status', value: 'Stock_Length', sortable: false },

            ],
            formSearchData: {  SawCode: '', QuoteID: '', extn_id: '', loc:'',  }, loading:false,
        }),

    computed: 
      {  ...mapState({
                       
                         stateNode: state => state.saw.profilecutting[0],
                          selectedJob: state => state.saw.selectedJob,
                         selectedSaw: state => state.saw.selectedSaw,
                           stateNodes3: state => state.saw.jobdetails,
                          selectedJobDetail: state => state.saw.selectedJobDetail,
                          flaggedjob:state => state.saw.flaggedjob
          }),
          order() {    return stateNode[0].Profile_Section;
          }
          ,
                   showflag1(){
           
            if(this.flaggedjob)
            {  if(this.flaggedjob.quote_ID==this.selectedJob.quote_ID
                && this.flaggedjob.order_ID==this.selectedJob.Order_Number
                && this.flaggedjob.cut_saw==this.selectedJob.cut_saw
                && this.flaggedjob.review>0 && this.flaggedjob.review != 9 
                && this.flaggedjob.review !=6)
                {   this.showflag=true;
                  
                    return this.showflag;
                    }
            }
                else if(this.selectedJob.review>0 && this.selectedJob.review != 9 && this.selectedJob.review !=6 )
                {  this.showflag=true;
                  
                  return this.showflag;

                }
                else return;
          }
      },
    watch: {   },
    created () {  },
    mounted() {    
              },
    methods: 
          {              
              onClickSChange(action, data, index)
              { 
                  //---for cut status
                 // if( this.selectedJob.AllowEdit==0 && this.selectedJob.review ==0 )
                   if( this.selectedJob.AllowEdit==0 ) //0 - allowed to cut, 1- not allwed to cut
                     {  this.formData.ID= data.ID;
                       this.formData.SawCode=this.selectedSaw;
                       this.formData.status=data.Status_id;
                      //--------------------------
                    
                      this.$store.dispatch('updateCutList', this.formData)
                             .then((response) =>  {   })     
                             .catch((error) => {         });
                      this.resetFormData();
                    }
                  else 
                         {
                            // this.$store.dispatch('showErrorNotification', 'Only Unflagged InProgress and UpNext Jobs can be Cut');
                             this.$store.dispatch('showErrorNotification', 'This Job is not allowed to be cut');
                             return;

                        }
              },
              resetFormData() {  this.formData = {  ID: '', status:'',SawCode:'', Location:''  }; },
          },

  }
</script>
<style scoped>
.disable-events {
  pointer-events: none
}
</style>