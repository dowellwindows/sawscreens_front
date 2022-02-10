<template> 
    <div class="mt-3">
    <v-progress-linear
        :active="loading"
        :indeterminate="loading"
        absolute
        top
        color="deep-purple accent-4"
    ></v-progress-linear>
  <v-data-table :headers="headers" :items="aa.data"  class="elevation-1" :search="search" dense
       :footer-props="{showFirstLastPage: true, itemsPerPageOptions: [20,40,100] ,
       'show-current-page':true,}" 
       @pagination="paginate" 
       :server-items-length="aa.total"

       >
 <template v-slot:top >
        <v-toolbar flat color="blue darken-4" dense dark>
          <v-toolbar-title>SAW</v-toolbar-title>
          <v-divider class="mx-4" inset vertical ></v-divider>
          <v-toolbar-title>BARS </v-toolbar-title>
          <v-spacer></v-spacer>
                <v-text-field
        v-model="search"  @input="searchit"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      ></v-text-field>
        </v-toolbar>
    </template>
    <template v-slot:item.updatedat="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
      <span>{{moment(item.updated_at).format('DD-MM-YY, h:mm:ss')}}</span>
    </template>
      <template v-slot:item.action="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
       <v-btn class="disable-events" ripple x-small v-if="item.status_id =='2'"  color="red accent-2" rounded dark :loading="loading"  @click.prevent="selectjob(item)" >InPrg</v-btn>
       <v-btn class="disable-events" ripple x-small v-else-if="item.status_id =='3'"  color="teal" rounded dark :loading="loading"  @click.prevent="selectjob(item)" >Cmplt</v-btn>
       <v-btn class="disable-events" ripple x-small v-else color="light-blue darken-1" rounded dark :loading="loading"   @click.prevent="selectjob(item)" >Queud</v-btn>
    </template>
    <template slot="no-data">
      <div></div>
    </template>
  </v-data-table>
 </div>
</template>
<script>
import Vue from 'vue'
import axios from "axios";
export default
{  
  data() { return {dialog: false,search: '',aa:[],loading:false,
          headers: [
           // { text: 'ID', align: 'left', value: 'id'},
            //  { text: 'created_at', align: 'left', value: 'created_at'},
               //{ text: 'updated_at', align: 'left',  value: 'updated_at'},
               { text: 'updated_at', align: 'left',  value: 'updatedat',width:"10%"},
            //  { text: 'created_by', align: 'left',  value: 'created_by.name'},
               { text: 'updated_by', align: 'left',  value: 'updated_by.name'},
             // { text: 'cut_date', align: 'left',  value: 'cut_date'},
              { text: 'schedule_saw', align: 'left',  value: 'schedule_saw'},
              { text: 'extn_id', align: 'left',  value: 'extn_id'},
              { text: 'quote_ID', value: 'quote_ID',sortable: false },
              { text: 'bar_qty', value: 'bar_quantity' ,sortable: false},
              { text: 'Time (Min)', value: 'cut_time',sortable: false },
             // { text: 'Status', value: 'status_id', sortable: false },
              { text: 'Status', value: 'action', sortable: false,width:"1%" },
             // { text: 'Flag', value: 'review', sortable: false },
            ],
             }
          },
 methods:{
            paginate(e){ 
            this.loading=true;
            //axios.get(`http://127.0.0.1:8000/api/saw/getsawschedules?page='+${e.page}`,{})
             axios.get(`${axios.defaults.baseURL}/saw/getsawbars?page=${e.page}`,
             {params:{'per_page':e.itemsPerPage}})
               // this.$store.dispatch(`getsawschedules?page='+${e.page}`,{})
                    .then((res) => { 
                                      this.aa=res.data.response; this.loading=false;  })
                    .catch(err=>{  this.loading=false; })
            },
             searchit(e){
              
              if(e.length>2){ this.loading=true;
                 axios.get(`${axios.defaults.baseURL}/saw/searchsawbars?search=${e}`)
                    .then((res) => {
                                      this.aa=res.data.response; this.loading=false;  })
                    .catch(err=>{   })
                }
              if(e.length<=0){ this.loading=true;
                 axios.get(`${axios.defaults.baseURL}/saw/searchsawbars`)
                    .then((res) => {   
                                      this.aa=res.data.response; this.loading=false;  })
                    .catch(err=>{  this.loading=false; })

              }
            }
        }

}
</script>

<style scoped>
.disable-events {
  pointer-events: none
}
</style>