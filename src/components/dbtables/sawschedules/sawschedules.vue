<template> 
    <div class="mt-3">
    <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="deep-purple accent-4"
    ></v-progress-linear>
  <v-data-table :headers="headers" :items="aa.data"   class="elevation-1"  dense
       :footer-props="{showFirstLastPage: true, itemsPerPageOptions: [10,20,40] ,
       'show-current-page':true,}"   
       @pagination="paginate1" 
       :server-items-length="aa.total"
       :items-per-page=20 
       :search="search">
 <template v-slot:top >
        <v-toolbar flat color="blue darken-4" dense dark>
          <v-toolbar-title>SAW</v-toolbar-title>
          <v-divider class="mx-4" inset vertical ></v-divider>
          <v-toolbar-title>SCHEDULED JOBS </v-toolbar-title>
          <v-spacer></v-spacer>
                <v-text-field v-model="search" append-icon="mdi-magnify" label="Search"
                              @input="searchit" single-line hide-details></v-text-field>
        </v-toolbar>
    </template>
    <template v-slot:item.updatedat="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
       <span>{{moment(item.updated_at).format('DD-MM-YYYY, HH:mm')}}</span>
    </template>
    <template v-slot:item.cutday="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
       <span>{{moment(item.cut_date).format('DD-MM-YYYY')}}</span>
    </template>
    <template v-slot:item.tim="{ item }">
      {{ ~~(item.cut_time / 60) + ":" + (item.cut_time % 60 < 10 ? "0" : "") + item.cut_time % 60 }}
    </template>
    <!---=============status===========--------------->
   
    <template v-slot:item.action="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
    <!------------------->
 <v-tooltip bottom :disabled="item.comments==null">
   <template v-slot:activator="{ on }">
      <v-btn v-on="on"  ripple x-small v-if="item.status_id =='9'"  color="red accent-2" rounded dark :loading="loading"  @click.prevent="scrap(item)" >
         InPrg
        <span v-for="aa in sawflags" :key="aa.id" v-if="aa.id !=9">
            <span v-if="aa.id==item.review">  <!-- {{aa.id}} -->
              <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
            </span>
        </span>
      </v-btn>

       <!----------------->
       <v-btn v-on="on"  ripple x-small v-else-if="item.status_id =='12'"  color="teal" rounded dark :loading="loading"  @click.prevent="scrap(item)" >
         Cmplt
        <span v-for="aa in sawflags" :key="aa.id" v-if="aa.id !=9">
            <span v-if="aa.id==item.review">  <!-- {{aa.id}} -->
              <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
            </span>
        </span>
      </v-btn>
       <!----------------->
       
        <v-btn v-on="on"  ripple x-small v-else color="light-blue darken-1" rounded dark :loading="loading"   @click.prevent="scrap(item)" >
          Qud
          <span v-for="aa in sawflags" :key="aa.id" v-if="aa.id !=9">
              <span v-if="aa.id==item.review">  <!-- {{aa.id}} -->
                <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
              </span>
          </span>
        </v-btn>
      </template>
      <span v-if="item.comments !=null">{{item.comments}}</span>
      <span :disabled="item.comments ==null" ></span>
    </v-tooltip>
    </template>

    <!---===============status finish=========----->
  <!-- <template v-slot:item.flag="{ item }">
      <span v-for="aa in sawflags" :key="aa.id">
        <span v-if="aa.id==item.review">  
        <v-icon   v-bind:style="{ color: 'rgb('+aa.red+','+aa.green+','+aa.blue+')' }" > mdi-flag </v-icon> 
       </span>
      </span>
    </template>   
  -->
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
export default
{      computed: 
  {  ...mapState({ 
                        joblist:state =>state.saw.joblist,
                       // selectedSaw: state => state.saw.selectedSaw,
                        user: state => state.auth.user,
                        sawflags:state => state.saw.sawflags,
            }),
  },
  props:{bb:Array},
  data() { return {dialog: false,search: '',aa:[],loading:false,//paginate1: {},
          headers: [
            //  { text: 'created_at', align: 'left', value: 'created_at', },
            //  { text: 'created_by', align: 'left',  value: 'created_by.name'},
             // { text: 'updated_at', align: 'left',  value: 'updated_at',width:"1%"},
              { text: 'updated_at', align: 'left',  value: 'updatedat',width:"1%"},
              { text: 'updatedby', align: 'left',  value: 'updated_by.name',width:"1%"},
              //{ text: 'cut_date', align: 'left',  value: 'cut_date',width:"1%"},
              { text: 'cut_date', align: 'left',  value: 'cutday',width:"2%"},
              { text: 'quote_ID', value: 'quote_ID',sortable: false,width:"1%" },
              { text: 'order_ID', value: 'order_ID' ,sortable: false,width:"1%"},
               { text: 'Color', align: 'left',  value: 'cut_color',width:"1%"},
              { text: 'Customer', align: 'left',  value: 'cust_name',width:"2%"},
              
             // { text: 'cut_time', align: 'left',  value: 'cut_time'},
              { text: 'schedule_saw', align: 'left',  value: 'schedule_saw',width:"1%"},
              { text: 'cut_saw', align: 'left',  value: 'cut_saw',width:"1%"},
              
             // { text: 'Time (Min)', value: 'cut_time',sortable: false,width:"1%" },
              { text: 'Time (Min)', value: 'tim',sortable: false,width:"1%" },
              //{ text: 'Status', value: 'status_id', sortable: false },
              { text: 'Status', value: 'action', sortable: false,width:"1%" },
              //{ text: 'Flag', value: 'flag', sortable: false,width:"1%" },
              //{ text: 'Flag', value: 'review', sortable: false ,width:"1%"},
            ],
            formSearchData: {  SawCode: '',  QuoteID: '',  order_ID:'', selected1:[], cut_saw:'' ,'selerr':false }, 
             }
          },
      created(){  //this.paginate();
        },
        methods:{ 

            paginate1(e){
            
            if(this.search =='')
                { 
                axios.get(`${axios.defaults.baseURL}/saw/getsawschedules?page=${e.page}`,
                {params:{'per_page':e.itemsPerPage}})
                  // this.$store.dispatch(`getsawschedules?page='+${e.page}`,{})
                        .then((res) => {   
                                          this.aa=res.data.response; this.loading=false;  })
                        .catch(err=>{  this.loading=false; })
                }
              else{
                
                  let x=this.search;
                  if(x.length>3){ this.loading=true;

                    axios.get(`${axios.defaults.baseURL}/saw/searchsawschedules?search=${x}`,{params:{'per_page':20, 'page':e.page}} )
                        .then((res) => { 
                                          this.aa=res.data.response; this.loading=false;  })
                        .catch(err=>{  this.loading=false;  })
                    }
                  if(x.length<=0){ this.loading=true;

                    axios.get(`${axios.defaults.baseURL}/saw/getsawschedules?page=1`,
                {params:{'per_page':20}} )
                        .then((res) => {   
                                          this.aa=res.data.response; this.loading=false;  })
                        .catch(err=>{  this.loading=false; })

                  }

              //-----------------

              }
            },
            searchit(e){ this.search=e;
            
              if(e.length>3){ this.loading=true;
                 axios.get(`${axios.defaults.baseURL}/saw/searchsawschedules?search=${e}`,{params:{'per_page':20}} )
                    .then((res) => {  
                                      this.aa=res.data.response; this.loading=false;  })
                    .catch(err=>{  this.loading=false;  })
                }
              if(e.length<=0){ this.loading=true;
             
                 axios.get(`${axios.defaults.baseURL}/saw/getsawschedules?page=1`,
             {params:{'per_page':20}} )
                    .then((res) => {   
                                      this.aa=res.data.response; this.loading=false;  })
                    .catch(err=>{  this.loading=false; })

              }
            },
        scrap(data) 
                {   
            if(data.cut_saw !=null)    
            this.formSearchData.SawCode = data.cut_saw;
            else{
              this.formSearchData.SawCode = data.schedule_saw;

            }
            this.formSearchData.QuoteID = data.quote_ID;
           
            this.loading=true;
            this.$store.dispatch('getcutlist', this.formSearchData)
                .then((response) => { 
                this.loading=false; 
                    this.$router.push({  name: 'sscutlist',params: {data: data }   });
                })
                .catch((error) => {this.loading=false;});
          },
        selectjob(data)
          {  
              
              if(data.Status !="Queued" || this.user.admin =='1')
               {
                  this.loading=true;
               if(data.cut_saw==null)
                      { this.formSearchData.status=data.Status_id;
                        this.formSearchData.id = data.id;
                        this.formSearchData.order_ID = data.Order_Number;
                        this.$store.dispatch('updateJobList', this.formSearchData)
                        //this.loading=false;
                      }
               this.formSearchData.SawCode = data.cut_saw;
               this.formSearchData.QuoteID = data.quote_ID;
               
               this.$store.dispatch('selectedJob', data);
               this.$store.dispatch('getjobdetails', this.formSearchData)
                      .then((res) => 
                          { this.loading=false;
                            this.$router.push({  name: 'jobdetails'      });
                          })
                      .catch((error) => { });
                 }
             else{
                 swal.fire({ position: 'top-right',
                        title:'<span style="color:white">Queued Jobs can not be selected</span>',
                            timer: 2000, toast: true,background: 'purple',
                            });
                        return;
                  } 
           },
        },
        watch: {
  pagination: { 
    handler () {
      paginate1()
        .then((res) => {   
                                      this.aa=res.data.response; this.loading=false;  })
                    .catch(err=>{  this.loading=false; })
    },
    deep: true
  }
},
}
</script>

<style scoped>
.disable-events {
  pointer-events: none
}
.v-tooltip__content {
 

}
</style>