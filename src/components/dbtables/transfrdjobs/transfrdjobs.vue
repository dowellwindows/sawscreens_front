<template> 
    <div class="mt-5">
    <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="deep-purple accent-4"
        
    ></v-progress-linear>
  <v-data-table :headers="headers" :items="aa"  dense
  class="elevation-1" :search="search" sortBy="truck_no"
 :footer-props="{showFirstLastPage: true, itemsPerPageOptions: [-1,20,40], }"
 :hide-default-footer="true"
>
  <template v-slot:top>
        <v-toolbar dense color="light-blue darken-3" dark >
          <v-toolbar-title>TRANSFERRED JOBS</v-toolbar-title>
          <v-divider class="mx-4" inset vertical ></v-divider>

                    
          <v-spacer></v-spacer>
                <v-text-field v-model="search" class="serc" append-icon="mdi-magnify" label="Search" single-line hide-details
                ></v-text-field>&nbsp;
                
        </v-toolbar>
  </template>
<template v-slot:item.updatedat="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
       <span>{{moment(item.updated_at).format('DD-MM-YYYY, h:mm')}}</span>
    </template>
    <template v-slot:item.cutday="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
       <span>{{moment(item.saa).format('DD-MM-YYYY')}}</span>
    </template>
    <!------------------------>
    <template v-slot:item.from_status1="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
       <v-btn  ripple x-small v-if="item.from_status =='9'"  color="red accent-2" rounded dark :loading="loading"   >InPrg
       </v-btn>
       <v-btn  ripple x-small v-else-if="item.from_status =='12'"  color="teal" rounded dark :loading="loading"   >Cmplt
       </v-btn>
       <v-btn  ripple x-small v-else-if="item.from_status=='0' || item.from_status =='8'"  color="light-blue darken-1" rounded dark :loading="loading"   >QUD
       </v-btn>
       <v-btn  ripple x-small disabled v-else color="blue lighten-3" rounded dark :loading="loading" >NA</v-btn>

    </template><!------------------------------->
    <template v-slot:item.to_status1="{ item }" ><!--8,0=qd,9-inpr,12-complt----->

       <v-btn  ripple x-small v-if="item.to_status =='9'"  color="red accent-2" rounded dark :loading="loading"  @click.prevent="scrap(item)" >InPrg
       </v-btn>
       <v-btn  ripple x-small v-else-if="item.to_status =='12'"  color="teal" rounded dark :loading="loading"  @click.prevent="scrap(item)" >Cmplt
       </v-btn>
       <v-btn  ripple x-small v-else-if="item.to_status =='0' || item.to_status =='8'"  color="light-blue darken-1" rounded dark :loading="loading"  @click.prevent="scrap(item)" >QUD
       </v-btn>
       <v-btn  ripple x-small disabled v-else color="blue lighten-3" rounded dark :loading="loading" >NA</v-btn>

      </template><!------------------------------->
  

    <template slot="no-data">
      <div></div>
    </template>
  </v-data-table>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapState, mapActions} from 'vuex';
import axios from "axios";
import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
export default
{      computed: 
  {  ...mapState({   user: state => state.auth.user,   sawflags:state => state.saw.sawflags,  }),
      formattedDate(){return this.due ? format(parseISO(this.due),'do MMM yyyy') : ''}
  },
  data() { return {dialog: false,search: '',aa:[],loading:false,due:'',
          headers: [
             // { text: 'created_at', align: 'left', value: 'created_at',width:"1%" },
              { text: 'updated_by', align: 'left',  value: 'created_by.name',width:"1%"},
              { text: 'updated_at', align: 'left',  value: 'updatedat',width:"1%"},
            // { text: 'cut_date', align: 'left',  value: 'cutday',width:"1%"},
            // { text: 'TrkNo', align: 'left',  value: 'truck_no',width:"1%"},
              { text: 'orderID', align: 'left',  value: 'order_ID',width:"1%"},
              { text: 'CutDt', align: 'left',  value: 'cutday',width:"1%"},
              { text: 'FrmSaw', align: 'left',  value: 'from_saw',width:"1%"},
              { text: 'FrmStatus', align: 'left',  value: 'from_status1',width:"1%"},
              { text: 'FrmCtTim', align: 'left',  value: 'from_cut_time',width:"1%"},
              { text: 'FrmClr', align: 'left',  value: 'from_color',width:"1%"},
              { text: 'ToSaw', align: 'left',  value: 'to_saw',width:"1%"},
              { text: 'ToStatus', align: 'left',  value: 'to_status1',width:"1%"},
              { text: 'ToCtTim', align: 'left',  value: 'to_cut_time',width:"1%"},
              { text: 'ToClr', align: 'left',  value: 'to_color',width:"1%"},
              { text: 'CUSTOMER', align: 'left',  value: 'cust_name',width:"5%"},

              
            //  { text: 'quote_ID', align: 'left',  value: 'quote_ID',width:"1%"},
            //  { text: 'Fly Screens', align: 'left',  value: 'fly1',width:"1%"},
            //  { text: 'Security Screens', align: 'left',  value: 'sec1',width:"1%"},
           //   { text: 'DSW', align: 'left',  value: 'dsw1',width:"1%"},
          //    { text: 'WinSash', align: 'left',  value: 'windows1',width:"1%"},
           //   { text: 'EaSash', align: 'left',  value: 'easash1',width:"1%"},
           //   { text: 'Awnings', align: 'left',  value: 'eadfl1',width:"1%"},
           //   { text: 'BFHD', align: 'left',  value: 'bfhd1',width:"1%"},
           //   { text: 'Comrcial', align: 'left',  value: 'commercial1',width:"1%"},
           //   { text: 'Transfr', align: 'left',  value: 'transfer1',width:"1%"},
             //  { text: 'Timber', align: 'left',  value: 'timber1',width:"1%"},


            ],
            formSearchData: {  SawCode: '',  QuoteID: '',  order_ID:'', selected1:[], cut_saw:'' ,'selerr':false }, 
             }
          },
      created(){  
        
          let today = new Date();
             this.due=new Date(today.getTime() - today.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
            
         this.getjobsummary(this.due);
        },
        methods:{ 
          change(){
              
          },
            scrap(data) 
                {     
                  this.formSearchData.SawCode = data.to_saw;
                //  else{this.formSearchData.SawCode = data.schedule_saw;   }
                  this.formSearchData.QuoteID = data.quote_ID;
                 
                  this.loading=true;
                  this.$store.dispatch('getcutlist', this.formSearchData)
                        .then((response) => { 
                  this.loading=false; 
                    this.$router.push({  name: 'tjcutlist',params: {data: data }   });
                      })
                      .catch((error) => {this.loading=false;});
                },

          async getjobsummary(x){
            this.formSearchData={};
           
           let res1= await axios.post(`${axios.defaults.baseURL}/saw/transfrdjobs`)       
           .then((res) => {  
                            this.aa=res.data;
                        //-------------------------------------
                            })
                    .catch(err=>{   })
          }
            
        },
      watch: {
        due(val,val1) {
        
          if (val != val1){
            this.due=val;
          this.getjobsummary(this.due)}
        }
      }

}
</script>

<style scoped>
.disable-events {
  pointer-events: none
}
</style>