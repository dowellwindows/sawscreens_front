<template> 
    <div class="mt-5">
    <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="deep-purple accent-4"
        
    ></v-progress-linear>
  <v-data-table :headers="headers" :items="aa"  
  class="elevation-1" :search="search" 
 v-model="selected" show-select
       :footer-props="{showFirstLastPage: true, itemsPerPageOptions: [10,20,40,-1], }">
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
    <template v-slot:item.cut_date1="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
       <span>{{moment(item.cut_date).format('DD-MM-YYYY')}}</span>
    </template>
    <!------------------------>
         <template v-slot:item.tim="{ item }">
      {{ ~~(item.cut_time / 60) + ":" + (item.cut_time % 60 < 10 ? "0" : "") + item.cut_time % 60 }}
    </template>
<!----status---->
     <template v-slot:item.status="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
       <v-btn  ripple small v-if="item.status_id =='9'"  color="red accent-2" rounded dark :loading="loading"  @click.prevent="scrap(item)" >InPrg
        <span v-for="aa in sawflags" :key="aa.id">
            <span v-if="aa.id==item.review">  <!-- {{aa.id}} -->
            <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
            </span>
        </span>
       </v-btn>
       <v-btn  ripple small v-else-if="item.status_id =='12'"  color="teal" rounded dark :loading="loading"  @click.prevent="scrap(item)" >Cmplt
          <span v-for="aa in sawflags" :key="aa.id" v-if="aa.id !=9">
            <span v-if="aa.id==item.review">  <!-- {{aa.id}} -->
            <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
          </span>
          </span>
       </v-btn>
       <v-btn  ripple small v-else-if="item.status_id =='0' || item.status_id =='8'"  color="light-blue darken-1" rounded dark :loading="loading"  @click.prevent="scrap(item)" >QUEUED
          <span v-for="aa in sawflags" :key="aa.id" v-if="aa.id !=9">
            <span v-if="aa.id==item.review">  <!-- {{aa.id}} -->
            <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
          </span>
          </span>
       </v-btn>
       <v-btn  ripple small disabled v-else color="blue lighten-3" rounded dark :loading="loading" >NA</v-btn>

    </template>
    <!------------------------------->
    <!----cutall---------->
    <template v-if="user.admin =='1'" v-slot:item.cutall="{ item }" >
       <v-btn v-if="item.status_id =='12'" small outlined color="red accent-2" rounded dark :loading="loadingcut"  @click.prevent="cutall(item)">UnCutJob</v-btn>
       <v-btn v-else  small color="teal" outlined rounded dark :loading="loadingcut"   @click.prevent="cutall(item)">CutJob</v-btn>
    </template>
    <!------multiselect-------->
  

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
  data() { return {dialog: false,search: '',aa:[],loading:false,due:'',loadingcut:false,selected: [],
          headers: [
             //{ text: 'updated_at', value: 'updated_at', sortable: false },
              { text: 'Cut Date', align: 'left', sortable: false, value: 'cut_date1', width:"15%"},
              { text: 'Order No', value: 'order_ID',sortable: false },
              { text: 'TrkNo', align: 'left',  value: 'truck_no',width:"1%"},
            //   { text: 'truckno', value: 'Priority' ,sortable: false},
              { text: 'Customer', value: 'cust_name' ,sortable: false},
             // { text: 'Time (Min)', value: 'Time',sortable: false },
              { text: 'Time (Min)', value: 'tim',sortable: false },
              { text: 'Color', value: 'cut_color', sortable: false},
             // { text: 'Flag', value: 'flag', sortable: false },
              { text: 'Status', value: 'status', sortable: false },
              { text: 'CutJob', value: 'cutall', sortable: false },
            ],
            formSearchData: {  SawCode: '',  QuoteID: '',  order_ID:'', selected1:[], cut_saw:'' ,'selerr':false }, 
             }
          },
      created(){  
          let today = new Date();
             this.due=new Date(today.getTime() - today.getTimezoneOffset() * 60 * 1000).toISOString().split('T')[0]
           
         this.getjobsummary();
        },
        methods:{ 
           cutall(data){
                   
                      
                        this.formSearchData.QuoteID = data.quote_ID;
                        this.formSearchData.order_ID = data.order_ID;
                        this.formSearchData.cut_saw = data.cut_saw;
                        this.formSearchData.SawCode = data.cut_saw;
                        this.formSearchData.loc = "GBG";
                                   
                        this.$store.dispatch('jobcutall', this.formSearchData)
                       .then((res) => 
                                  { this.loadingcut=false;
                                  this.getjobsummary();
                                  })
                        this.resetformSearchData();
                },
            resetformSearchData(){
                           this.formSearchData= {  SawCode: '',QuoteID: '',order_ID:'',selected1:[], cut_saw:''}
                       },
 
          change(){
            
          },
            scrap(data) 
                {    
                  this.formSearchData.SawCode = data.cut_saw;
                //  else{this.formSearchData.SawCode = data.schedule_saw;   }
                  this.formSearchData.QuoteID = data.quote_ID;
                
                  this.loading=true;
                  this.$store.dispatch('getcutlist', this.formSearchData)
                        .then((response) => { 
                  this.loading=false; 
                    this.$router.push({  name: 'jscutlist',params: {data: data }   });
                      })
                      .catch((error) => {this.loading=false;});
                },

          async getjobsummary(){
            this.formSearchData={};
           
           let res1= await axios.post(`${axios.defaults.baseURL}/saw/transfrsaw`)       
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