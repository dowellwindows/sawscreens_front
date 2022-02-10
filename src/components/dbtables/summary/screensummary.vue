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
        <v-toolbar  color="light-blue darken-3" dark >
          <v-toolbar-title>SCREENS SUMMARY</v-toolbar-title>
          <v-divider class="mx-4" inset vertical ></v-divider>
                  <v-menu max-width="290">
                      <template v-slot:activator="{ on }">
                            <v-text-field :value="formattedDate" label="Cut Date" 
                            append-icon="mdi-calendar-range" v-on="on" single-line hide-details></v-text-field>
                      </template>
                      <v-date-picker v-model="due"></v-date-picker>
                    </v-menu>
                    
          <v-spacer></v-spacer>
                <v-text-field v-model="search" class="serc" append-icon="mdi-magnify" label="Search" single-line hide-details
                ></v-text-field>&nbsp;
                
        </v-toolbar>
    </template>
<template v-slot:item.updatedat="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
       <span>{{moment(item.updated_at).format('DD-MM-YYYY, h:mm:ss')}}</span>
    </template>
    <template v-slot:item.cutday="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
       <span>{{moment(item.cut_date).format('DD-MM-YYYY')}}</span>
    </template>
    <!------------------------>
    <template v-slot:item.fly1="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
      <v-tooltip bottom :disabled="item.flyscreens.comments==null">
      <template v-slot:activator="{ on }">
       <v-btn v-on="on" ripple x-small v-if="item.flyscreens.status_id =='9'"  color="red accent-2" rounded dark :loading="loading"  @click.prevent="scrap(item.flyscreens)" >InPrg
          <span v-for="aa in sawflags" :key="aa.id" v-if="aa.id !=9">
            <span v-if="aa.id==item.flyscreens.review">  <!-- {{aa.id}} -->
            <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
            </span>
          </span>
       </v-btn>
       <v-btn v-on="on" ripple x-small v-else-if="item.flyscreens.status_id =='12'"  color="teal" rounded dark :loading="loading"  @click.prevent="scrap(item.flyscreens)" >Cmplt
          <span v-for="aa in sawflags" :key="aa.id" v-if="aa.id !=9">
            <span v-if="aa.id==item.flyscreens.review">  <!-- {{aa.id}} -->
            <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
          </span>
          </span>
       </v-btn>
       <v-btn v-on="on" ripple x-small v-else-if="item.flyscreens.status_id =='0' || item.flyscreens.status_id =='8'"  color="light-blue darken-1" rounded dark :loading="loading"  @click.prevent="scrap(item.flyscreens)" >QUD
          <span v-for="aa in sawflags" :key="aa.id" v-if="aa.id !=9">
            <span v-if="aa.id==item.flyscreens.review">  <!-- {{aa.id}} -->
            <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
          </span>
          </span>
       </v-btn>
       <v-btn v-on="on" ripple x-small disabled v-else color="blue lighten-3" rounded dark :loading="loading" >NA</v-btn>
             </template>
      <span v-if="item.flyscreens.comments !=null">{{item.flyscreens.comments}}</span>
      <span  ></span>
    </v-tooltip>
    </template><!------------------------------->
    <template v-slot:item.sec1="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
      <v-tooltip bottom :disabled="item.secscreens.comments==null">
      <template v-slot:activator="{ on }">
       <v-btn v-on="on" ripple x-small v-if="item.secscreens.status_id =='9'"  color="red accent-2" rounded dark :loading="loading"  @click.prevent="scrap(item.secscreens)" >InPrg
         <span v-for="aa in sawflags" :key="aa.id" v-if="aa.id !=9">
          <span v-if="aa.id==item.secscreens.review"> 
          <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
          </span>
        </span>
       </v-btn>
       <v-btn v-on="on" ripple x-small v-else-if="item.secscreens.status_id =='12'"  color="teal" rounded dark :loading="loading"  @click.prevent="scrap(item.secscreens)" >Cmplt
        <span v-for="aa in sawflags" :key="aa.id" v-if="aa.id !=9">
          <span v-if="aa.id==item.secscreens.review" > 
          <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
          </span>
        </span>
       </v-btn>
       <v-btn v-on="on" ripple x-small v-else-if="item.secscreens.status_id =='0' || item.secscreens.status_id =='8'"  color="light-blue darken-1" rounded dark :loading="loading"  @click.prevent="scrap(item.secscreens)" >QUD
        <span v-for="aa in sawflags" :key="aa.id" v-if="aa.id !=9">
          <span v-if="aa.id==item.secscreens.review">  
          <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
          </span>
        </span>
       </v-btn>
       <v-btn v-on="on" ripple x-small disabled v-else color="blue lighten-3" rounded dark :loading="loading" >NA</v-btn>
             </template>
      <span v-if="item.secscreens.comments !=null">{{item.secscreens.comments}}</span>
      <span  ></span>
    </v-tooltip>
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
            //  { text: 'created_at', align: 'left', value: 'created_at', },
            //  { text: 'created_by', align: 'left',  value: 'created_by.name'},
             // { text: 'updated_at', align: 'left',  value: 'updatedat',width:"1%"},
             { text: 'cut_date', align: 'left',  value: 'cutday',width:"1%"},
             { text: 'TrkNo', align: 'left',  value: 'truck_no',width:"1%"},
              { text: 'orderID', align: 'left',  value: 'order_ID',width:"1%"},
               { text: 'Color', align: 'left',  value: 'cut_color',width:"1%"},
              { text: 'CUSTOMER', align: 'left',  value: 'cust_name',width:"5%"},

              
            //  { text: 'quote_ID', align: 'left',  value: 'quote_ID',width:"1%"},
              { text: 'Fly Screens', align: 'left',  value: 'fly1',width:"1%"},
              { text: 'Security Screens', align: 'left',  value: 'sec1',width:"1%"},
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
                  if(data.cut_saw !=null)    
                  this.formSearchData.SawCode = data.cut_saw;
                  else{this.formSearchData.SawCode = data.schedule_saw;   }
                  this.formSearchData.QuoteID = data.quote_ID;
                 
                  this.loading=true;
                  this.$store.dispatch('getcutlist', this.formSearchData)
                        .then((response) => { 
                  this.loading=false; 
                    this.$router.push({  name: 'jscutlist',params: {data: data }   });
                      })
                      .catch((error) => {this.loading=false;});
                },

          async getjobsummary(x){
            this.formSearchData={};
           
           let res1= await axios.post(`${axios.defaults.baseURL}/saw/jobsummary`, {'date':x})       
           .then((res) => { 
                            this.aa=res.data;

                            let myObj=this.aa;
                            

                            Object.keys(myObj).forEach(key => {
                            
                              
                              if((myObj[key].secscreens)==""
                              && (myObj[key].flyscreens)==""
                            //  && (myObj[key].dsw)==""
                            //  && (myObj[key].windows)==""
                            //  && (myObj[key].easash)==""
                            //  && (myObj[key].eadfl)==""
                            //  && (myObj[key].bfhd)==""
                            //  && (myObj[key].commercial)==""
                            //  && (myObj[key].transfer)==""
                              ){
                               
                                delete myObj[key]
                              }
                            });
                              


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