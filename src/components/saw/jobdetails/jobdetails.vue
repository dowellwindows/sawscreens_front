<template>
<div>
   <v-container grid-list-lg pa-0 mt-2>
    <v-layout wrap>
       <v-flex xs12>
         <v-btn  text  color="grey" @click="backToJob">
            <v-icon  mr-3>mdi-keyboard-backspace</v-icon>RETURN TO JOB</v-btn>
     <!----popup---------------->       
    <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
             <v-btn id="flag-btn" ripple small color="red"  rounded dark  v-on="on" 
                 ><v-icon  >mdi-flag-outline</v-icon>Flag</v-btn>
          </template>
          <!----popup---------------->
          <v-card>
            <v-card-title><span class="headline" >FLAG</span></v-card-title>
            <v-card-text class="text-center">
              <v-container>
                <div v-for="(stateNode,index) in sawflags1" class="text-center">
                  <template>
                  <v-btn block rounded v-if="stateNode.name !='UnFlag'" class="mx-2 mb-2 pl-20 pr-20"  dark   
                        @click="OnSave(stateNode.id)"
                        v-bind:style="{ 'background-color': 'rgb('+stateNode.red+','+stateNode.green+','+stateNode.blue+')', 'color': 'white' }">
                            {{ stateNode.name }}
                  </v-btn>
                   <v-btn block rounded v-if="stateNode.name =='UnFlag'" class="mx-2 mb-2 pl-20 pr-20"  dark   
                        @click="OnSave(stateNode.id)"
                        v-bind:style="{ 'background-color': 'rgb('+stateNode.red+','+stateNode.green+','+stateNode.blue+')', 'color': 'black', 'border-color':'black' }">
                            {{ stateNode.name }}
                  </v-btn>
                  </template>
                </div>
                <div class="text-center">
                    <v-text-field label="Comment" outlined v-model="cmt1.val" ></v-text-field>
                </div>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
<!----------------dialog for flag finished----------------------------------->
        <v-btn id="flag-btn" ripple small color="blue"  rounded dark  :loading="loadingcutlist" 
                  @click.prevent="scrap"><v-icon  >mdi-clipboard-list</v-icon>CUTLIST</v-btn>
        <v-btn id="flag-btn" ripple small color="orange"  rounded dark :loading="loadingcutall"
                  @click.prevent="cutall"><v-icon  >mdi-check-all</v-icon>CUTALL</v-btn>


<!-----------------dialog for print-start---------------------------->

<v-dialog v-model="printdialog" max-width="500px">
          <template v-slot:activator="{ on }">
        <v-btn id="flag-btn" ripple small color="purple lighten-3" :loading="loadingprint" rounded dark  v-on="on">
            <v-icon  >mdi-printer</v-icon>Print</v-btn>
          </template>
          <!----popup---------------->
          <v-card>
            <v-card-title><span class="headline" >PRINT REPORTS</span></v-card-title>
            <v-card-text>
              <v-container>
                <div v-for="(stateNode,index) in sawpr">
                  <template>
                   <v-btn block rounded class="mx-2 mb-2 "  outlined  v-bind:style="{  'border-color':'blue !important'}"
                    color="blue" @click="OnSavePrint(stateNode)">
                      Report:{{ stateNode.name }} <!-- <BR/>Printer:{{ stateNode.printer }} -->
                  </v-btn>
                  </template>
                </div>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
                  <v-btn color="blue darken-1" text @click="closeprint">Cancel</v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog>

<!-------------dialog for print stop--------------------------------->
        <v-btn id="flag-btn" ripple small color="blue darken-4"  rounded dark   :loading="loadingexttosaw"
                  @click.prevent="exttosawjd"><v-icon  >mdi-share-circle</v-icon>Ext-To-Saw</v-btn>
    <!--    <v-btn id="flag-btn" ripple small color="cyan"  rounded dark   
                  @click.prevent="changesaw"><v-icon  >mdi-circular-saw</v-icon>ChangeSaw</v-btn>
        <v-btn id="flag-btn" ripple small color="green accent-4"  rounded dark   
                  @click.prevent="reoptimise" ><v-icon  >mdi-cog-clockwise</v-icon>Re-Optimise</v-btn> 
        <v-btn id="flag-btn" ripple small color="blue accent-4"  rounded dark   :loading="loadingfixstatus"
                  @click.prevent="fixstatus" ><v-icon  >mdi-cog-clockwise</v-icon>fix-status</v-btn> -->
                  
 

    
            
       </v-flex>
 
   <v-flex xs12 pt-0>
         <job-details-list ></job-details-list>
    </v-flex> 
  </v-layout>
 </v-container>
 </div>
</template>
<script>
 import JobDetailsList from './jobdetailslist.vue'
 import { mapGetters, mapState, mapActions} from 'vuex';
export default {
    computed: { ...mapGetters({}),
        ...mapState({ user: state => state.auth.user,
            stateNodes3: state => state.saw.jobdetails,
            selectedJob: state => state.saw.selectedJob,
            selectedSaw: state => state.saw.selectedSaw,
            joblist1: state => state.saw.joblist,
            sawflags:state => state.saw.sawflags,
            sawprints:state => state.saw.sawprints,
            flaggedjob:state => state.saw.flaggedjob
            }),
        sawflags1(){
            let bb= this.sawflags.filter( x => x.id !=  6 );
            return bb;

        },
        sawpr(){  
                    let aa=this.selectedSaw
                   
                    let bb= this.sawprints.filter( x => (x.saw ==  this.selectedSaw 
                    && x.instruct ==  'JobDetails'));
                  
                   
                    return bb;
                },
        cmt1(){ 
           if(this.flaggedjob && this.flaggedjob.quote_ID==this.selectedJob.quote_ID
                        && this.flaggedjob.order_ID==this.selectedJob.Order_Number
                        && this.flaggedjob.cut_saw==this.selectedJob.cut_saw)
                    {  
                            this.cmt.val=this.flaggedjob.comments
                          
                                return this.cmt ;
                       
                    }
                    else 
                    {  
                        this.cmt.val=this.selectedJob.comments
                          
                                return this.cmt ;
                    }
                  
        },
        /*cmt(){   if(this.flaggedjob)
                    {  if(this.flaggedjob.quote_ID==this.selectedJob.quote_ID
                        && this.flaggedjob.order_ID==this.selectedJob.Order_Number
                        && this.flaggedjob.cut_saw==this.selectedJob.cut_saw
                        && this.flaggedjob.review>0 && this.flaggedjob.review != 9 
                        && this.flaggedjob.review !=6)
                        {   //this.showflag=true;
                          
                            return this.flaggedjob.comments;
                        }
                    }
                    else if(this.selectedJob.review>0 && this.selectedJob.review != 9 && this.selectedJob.review !=6 )
                    {  this.showflag=true;
                       
                    return this.showflag;
                    }
                    else return;
            } */
        },
    created(){   },
    data() {  return { seen: true,dialog: false,printdialog: false,loadingexttosaw:false, 
                        loadingcutall:false,loadingcutlist:false,cmt:{val:''},
                    formSearchData: {  SawCode: '',  QuoteID: '',  extn_id: '',  loc:'',flag:'',id:'',cmt:''  },
                    loadingprint:false, loadingfixstatus:false, 
                    }
            },
components: {   'job-details-list': JobDetailsList,  },
methods: {   close(){ this.dialog=false;}, 
            closeprint(){ this.printdialog=false;},
    OnSave(x){ 
                if(this.user.admin =='3')
                            { this.dialog=false; this.close()
                              swal.fire({ position: 'top-right',
                                                title:'<span style="color:white">Access denied: View only user</span>',
                                                timer: 2000, toast: true, background: 'red',
                                                });
                                                
                              return;
                            }
//-------------------

                this.formSearchData.SawCode = this.selectedSaw;
                this.formSearchData.flag = x;
                this.formSearchData.comments = this.cmt.val;
                this.formSearchData.id = this.selectedJob.id;
               
                this.$store.dispatch('updateFlag', this.formSearchData)
                    .then((response) => {   swal.fire({ position: 'top-right',
                                                title:'<span style="color:white">Flag change successful</span>',
                                                timer: 2000, toast: true,background: 'purple',
                                            });
                                        return;
                                        })
                    .catch((error) => {       });
                this.dialog=false;
               // this.cmt='';
            },
        fixstatus() { this.formSearchData.QuoteID = this.selectedJob.quote_ID;
                this.formSearchData.SawCode = this.selectedSaw;
                this.loadingfixstatus=true;
                
                this.$store.dispatch('fixstatus', this.formSearchData)
                .then((response) => {   
                
                this.loadingfixstatus=false; 
                 swal.fire({ position: 'top-right',
                            title:'<span style="color:white">Status Fixed</span>',
                            timer: 2000, toast: true,background: 'purple',
                            });     })
                .catch((error) => { 
                    this.loadingfixstatus=false;   });
            },
        OnSavePrint(x)
        {  
                if(this.user.admin =='3')
                            {  this.printdialog=false; this.close()
                              swal.fire({ position: 'top-right',
                                                title:'<span style="color:white">Access denied: View only user</span>',
                                                timer: 2000, toast: true, background: 'red',
                                                });
                                                
                              return;
                            }
//------------------------------
            this.formSearchData.report = x.name;
            this.formSearchData.QuoteID = this.selectedJob.quote_ID;
            this.formSearchData.SawCode = this.selectedSaw;
            this.formSearchData.printer = x.printer;
            this.formSearchData.alias = x.alias;
            this.loadingprint=true;
           
                        this.$store.dispatch('sawprint', this.formSearchData)
                 .then((response) => {  
                 this.loadingprint=false;
                    })
                    .catch((error) => {this.loadingprint=false;});
                this.printdialog=false;
        },
        backToJob() { //this.$router.push({name: 'joblist'});  
                this.formSearchData.SawCode = this.selectedSaw;
                this.formSearchData.Location = "GBG";               
                this.$store.dispatch('getJobs', this.formSearchData)
                .then((response) => { this.$router.push({name: 'joblist'});
                                    })
                },
        scrap() 
                { 
            this.formSearchData.SawCode = this.selectedSaw;
            this.formSearchData.QuoteID = this.selectedJob.quote_ID;
          
            this.loadingcutlist=true;
            this.$store.dispatch('getcutlist', this.formSearchData)
                .then((response) => { 
                this.loadingcutlist=false; 
                    this.$router.push({  name: 'cutlist'   });
                })
                .catch((error) => {this.loadingcutlist=false;});
                },
            //-----------scrap finish---------------------

    exttosawjd() { 
         //-----------view only user-------
                if(this.user.admin =='3')
                            { this.dialog=false; this.close()
                              swal.fire({ position: 'top-right',
                                                title:'<span style="color:white">Access denied: View only user</span>',
                                                timer: 2000, toast: true, background: 'red',
                                                });
                                                
                              return;
                            }
//------------------------------
        this.formSearchData.QuoteID = this.selectedJob.quote_ID;
                this.formSearchData.SawCode = this.selectedSaw;
                this.formSearchData.loc = "GBG";
                this.loadingexttosaw=true;
                this.$store.dispatch('exttosawjd', this.formSearchData)
                .then((response) => {  this.loadingexttosaw=false;      })
                .catch((error) => {this.loadingexttosaw=false;});
            },
    //------------------------------------------------
        reoptimise() 
            {  swal.fire({ position: 'top-right',
            title:'<span style="color:white">This function will work in phase 2</span>',
                            timer: 2000, toast: true,background: 'purple',
                            });
                        return;
            },
    //----------------------------------------------
        cutall() 
        {    
//-----------view only user-------
                if(this.user.admin =='3')
                            { this.dialog=false; this.close()
                              swal.fire({ position: 'top-right',
                                                title:'<span style="color:white">Access denied: View only user</span>',
                                                timer: 2000, toast: true, background: 'red',
                                                });
                                                
                              return;
                            }
//------------------------------
          /*  if(this.flaggedjob)
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
                }
*/
            this.formSearchData.QuoteID = this.selectedJob.quote_ID;
            this.formSearchData.SawCode = this.selectedSaw;
            this.formSearchData.loc = "GBG";
            this.loadingcutall=true;
            this.$store.dispatch('cutall', this.formSearchData)
                .then((response) => {   this.loadingcutall=false;        })
                .catch((error) => {this.loadingcutall=false;});
        },
    //-----------------------------------------------
     

    changesaw() 
                {   swal.fire({ position: 'top-right',
                        title:'<span style="color:white">This function will work in version 2</span>',
                            timer: 2000, toast: true,background: 'purple',
                            });
                        return;
                },
            },
}
</script>
<style scoped>
#flag-btn{margin-left:10px}
#bbtn{ width:20%}
</style>