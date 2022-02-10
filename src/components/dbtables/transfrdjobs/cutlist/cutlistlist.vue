<template>
  <v-data-table :headers="headers" :items="cutlist"   class="elevation-1" :search="search" v-model="selected"
       item-key="ID" :footer-props="{showFirstLastPage: true, itemsPerPageOptions: [10,20,40,-1], }"
      :expanded.sync="expanded"
      show-expand
       >
    <template v-slot:top>
        <v-toolbar  color="light-blue darken-3" dark dense>
          <v-toolbar-title>CutList</v-toolbar-title>
          <v-divider class="mx-4" inset vertical ></v-divider>
          <v-toolbar-title>SAW - {{data.to_saw ? data.to_saw.replace(/_/g, " "):data.to_saw.replace(/_/g, " ") }}
            <v-divider class="mx-4" inset vertical ></v-divider>
          Order No - {{data.order_ID}}
          </v-toolbar-title>
          <v-spacer></v-spacer>
                <v-text-field v-model="search" class="serc" append-icon="mdi-magnify" label="Search" single-line hide-details
                ></v-text-field>&nbsp;
            
        </v-toolbar>
    </template>
<!-----------expand------------------------->
<template v-slot:expanded-item="{item, headers}">
        <td :colspan="headers.length">
          <v-data-table  :headers="headers1" :items="item.key1"   class="elevation-1" :search="search" v-model="selected" show-select
            item-key="ID" :hide-default-header="true"  :hide-default-footer="true" style="backgroundColor:#F1F1F5"  
            :footer-props="{itemsPerPageOptions: [-1], }">
            <template v-slot:item.action="{ item }" ><!--8,0=qd,9-inpr,12-complt----->
             <v-btn class="disable-events" ripple x-small v-if="item.Status_id =='7'"  color="teal" rounded dark :loading="loading"  @click.prevent="chstatus(item)">{{item.Status}}</v-btn>
       <v-btn class="disable-events"  ripple x-small v-else color="light-blue darken-1" rounded dark :loading="loading"   @click.prevent="chstatus(item)">{{item.Status}}</v-btn>
         </template>
        </v-data-table>

          </td>
      </template>

<!----status---------------------------->
<!--8,0=qd,9-inpr,12-complt----->
 <!--   <template v-slot:item.action="{ item }" >
             <v-btn ripple small v-if="item.Status_id =='7'"  color="teal" rounded dark :loading="loading"  @click.prevent="chstatus(item)">{{item.Status}}</v-btn>
       <v-btn ripple small v-else color="light-blue darken-1" rounded dark :loading="loading"   @click.prevent="chstatus(item)">{{item.Status}}</v-btn>
    </template> -->
<template v-slot:item.act1="{ item }" >
             <v-btn class="disable-events" ripple x-small dark v-if="item.queud >0"  color="light-blue darken-1" rounded  :loading="loading"  @click.prevent="cutgroup(item)">Cutgrp</v-btn>
       <v-btn class="disable-events" ripple dark x-small v-else color="teal" rounded  :loading="loading"   @click.prevent="uncutgroup(item)">UnCutgrp</v-btn>
</template> 
<template v-slot:item.action="{ item }" >
        <v-progress-linear rounded :value="item.perc" height="20" background-color="pink lighten-4" color="teal lighten-3" >
          <div class="text-center">{{item.complt}}/</div><div class="text-center">{{ item.queud + item.complt}}</div>
        </v-progress-linear>
</template>
  </v-data-table>
</template>
 
<script>
import { mapGetters, mapState, mapActions} from 'vuex';
  export default 
  {   data: () => (
        { dialog: false,search: '',selected: [],expanded: [],
          headers: [
             // { text: 'SNO', align: 'left', sortable: true, value: 'SNO', width:"1%"},
              { text: 'Extrusion', value: 'Extrusion',sortable: true, width:"1%" },
              { text: 'Description', value: 'Description', sortable: true, width:"30%"},
              { text: 'Stock_Length', value: 'Stock_Length', sortable: true, width:"1%"},
              { text: 'Item', value: 'itm', sortable: true, width:"30%" },
              { text: 'Color', value: 'Color', sortable: true, width:"1%" },
              { text: 'Piece_Length', value: 'Length', sortable: true , width:"1%"},
              { text: 'Qty', value: 'quanti', sortable: true ,width:"1%"},
              { text: 'CutGrp', value: 'act1', sortable: false ,width:"1%"},
              { text: 'Status', value: 'action', sortable: false, width:"1%"},
              ],
           headers1: [
              { text: 'SNO', align: 'left', sortable: true, value: 'SNO', width:"5%"},
              { text: 'Extrusion', value: 'Extrusion',sortable: true },
              { text: 'Description', value: 'Description', sortable: false},
              { text: 'Stock_Length', value: 'Stock_Length', sortable: true},
              { text: 'Item', value: 'Item', sortable: true },
              { text: 'Color', value: 'Color', sortable: false },
              { text: 'Piece_Length', value: 'Length', sortable: true },
              { text: 'Qty', value: 'Cuts', sortable: false },
              { text: 'Status', value: 'action', sortable: false },
              ],
           formSearchData: {    ID:'', name: '',    title: '',   id: '',SawCode:'',status:'',location:'', selected1:[] ,QuoteID:'', jid:''  }, 
           loading:false,loading1:false,loading2:false
        }),
    props: ['data'],
    computed: 
       {  ...mapState({ sawlist: state => state.saw.sawlist, 
                        cutlist:state =>state.saw.cutlist,
                        cutlist1:state =>state.saw.cutlist.key1,
                   }),
              cutlist111(){
                return this.cutlist.key1;
              },
         
       },
    methods: 
    {  cutgroup(item)
            {  
              var i = 0;
              while ( i < item.key1.length ) 
                { var x = item.key1[i];
                  if(x.Status_id==7)
                            { //do nothing if job is already complete
                            }
                    else this.formSearchData.selected1.push(x.ID);
                         i++;
                  }
                this.formSearchData.SawCode=this.selectedSaw;
                this.formSearchData.status=7;
                this.formSearchData.QuoteID = this.selectedJob.quote_ID;
                this.formSearchData.jid = this.selectedJob.id;
                this.loading=true;
              
                 this.$store.dispatch('updateselectedcutlist', this.formSearchData)
                        .then((response) =>  { this.loading=false;  })  
                        .catch((error) => {   this.loading=false;       });   
                this.resetformSearchData();
            },
        uncutgroup(item)
            { 
              var i = 0;
              while ( i < item.key1.length ) 
                { var x = item.key1[i];
                  if(x.Status_id==5)
                            { //do nothing if job is already queued
                            }
                    else this.formSearchData.selected1.push(x.ID);
                         i++;
                  }
                this.formSearchData.SawCode=this.selectedSaw;
                this.formSearchData.status=5;
                this.formSearchData.QuoteID = this.selectedJob.quote_ID;
                this.formSearchData.jid = this.selectedJob.id;
                this.loading=true;
              
                 this.$store.dispatch('updateselectedcutlist', this.formSearchData)
                        .then((response) =>  { this.loading=false;  })  
                        .catch((error) => {   this.loading=false;       });   
                this.resetformSearchData();
            },
        cutselected()//---==7=complt, 5=qued=====
          { 
            if(this.selected.length==0)
              {  swal.fire({ position: 'top-right',
                  title:'<span style="color:white">Please select rows to cut</span>',
                  timer: 2000, toast: true, background: 'purple',
                });
              }
            else
            { this.formSearchData.selected1=[];
           
              var i = 0;
              while ( i < this.selected.length ) 
                { var x = this.selected[i];
                  if (x){ this.selected.splice(i,1);
                            if(x.Status_id==7)
                            { swal.fire({ position: 'top-right',
                                title:'<span style="color:white">Only Queued cuts can be selected</span>',
                                timer: 2000, toast: true, background: 'purple',
                                });
                              this.selected=[];this.formSearchData.selected1=[];
                              return;
                            }
                            else this.formSearchData.selected1.push(x.ID);
                        }
                      else i++;
                }
               
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
                        } */
                       this.formSearchData.SawCode=this.selectedSaw;
                       this.formSearchData.status=7;
                       this.formSearchData.QuoteID = this.selectedJob.quote_ID;
                       this.formSearchData.jid = this.selectedJob.id;
                       this.loading1=true;
                     
                      this.$store.dispatch('updateselectedcutlist', this.formSearchData)
                         .then((response) =>  { this.loading1=false;  })  
                          .catch((error) => {   this.loading1=false;       });   
                            
                      this.resetformSearchData();
                     
                  }
                },//cutselected finish==========7=complt, 5=qued===========================================
        uncutselect()
          { 
            if(this.selected.length==0)
              {  swal.fire({ position: 'top-right',
                  title:'<span style="color:white">Please select rows to uncut</span>',
                  timer: 2000, toast: true, background: 'purple',
                });
              }
            else
            { this.formSearchData.selected1=[];
            
              var i = 0;
              while ( i < this.selected.length ) 
                { var x = this.selected[i];
                  if (x){ this.selected.splice(i,1);
                            if(x.Status_id==5)
                            { swal.fire({ position: 'top-right',
                                title:'<span style="color:white">Only Completed cuts can be selected</span>',
                                timer: 2000, toast: true, background: 'purple',
                                });
                              this.selected=[];this.formSearchData.selected1=[];
                              return;
                            }
                            else this.formSearchData.selected1.push(x.ID);
                        }
                      else i++;
                }
              
               /* if(this.flaggedjob)
                    {  if(this.flaggedjob.quote_ID==this.selectedJob.quote_ID
                        && this.flaggedjob.order_ID==this.selectedJob.Order_Number
                        && this.flaggedjob.cut_saw==this.selectedJob.cut_saw
                        && this.flaggedjob.review>0 && this.flaggedjob.review != 9 
                        && this.flaggedjob.review !=6)
                        {
                            swal.fire({ position: 'top-right',
                                title:'<span style="color:white">Flagged Jobs can not be uncut, please UnFlag it</span>',
                                    timer: 2000, toast: true,background: 'purple',
                                    });
                                return;
                            }
                    }
                        else if(this.selectedJob.review>0 && this.selectedJob.review != 9 && this.selectedJob.review !=6 )
                        {  
                            swal.fire({ position: 'top-right',
                                title:'<span style="color:white">Flagged Jobs can not be uncut, please UnFlag it</span>',
                                    timer: 2000, toast: true,background: 'purple',
                                    });
                                return;
                        } */
                       this.formSearchData.SawCode=this.selectedSaw;
                       this.formSearchData.status=5;
                       this.formSearchData.QuoteID = this.selectedJob.quote_ID;
                       this.formSearchData.jid = this.selectedJob.id;
                       this.loading2=true;
                  
                      this.$store.dispatch('updateselectedcutlist', this.formSearchData)
                             .then((response) =>  { this.loading2=false;  })  
                          .catch((error) => {   this.loading2=false;       });   
                      this.resetformSearchData();
                  }
                },//cutselected finish
              
              chstatus(data)
              { /*  if(this.flaggedjob)
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

                        } */
                    this.formSearchData.ID= data.ID;
                        this.formSearchData.SawCode=this.selectedSaw;
                        this.formSearchData.status=data.Status_id;                    
                        this.formSearchData.QuoteID = this.selectedJob.quote_ID;
                        this.formSearchData.jid = this.selectedJob.id;
                        this.loading=true;
                        this.$store.dispatch('updateScrapList', this.formSearchData)
                             .then((response) =>  { this.loading=false })     
                             .catch((error) => {  this.loading=false        });
                        this.resetformSearchData();
                   
              },
              resetformSearchData() {  this.formSearchData = {  ID: '', status:'',SawCode:'', Location:'' ,selected1:[],QuoteID:'',jid:'' }; },
          },

  }
</script>
<style scoped>

#btn-cutselected{margin-left:1%;}
.theme--light.v-data-table tbody td {
    font-size: 20px !important;
}
.v-data-table td{
   font-size: 10px;
}
tr > td > .text-left{
  padding-right:50px;
}
tr tbody
{
  margin-top: -25%;
}
.serc{
  width:5% !important;
}
.disable-events {
  pointer-events: none
}
</style>