<template>
    <div class="mt-3">
      <!--  <sawschedules v-bind:bb="aa" :loading="loading"></sawschedules> -->
      <v-progress-linear :active="loading" :indeterminate="loading" absolute   top  color="deep-purple accent-4"
      ></v-progress-linear>
   <v-data-table  :headers="headers" :items="sawflags"  class="elevation-1" >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>SAW Prints</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <!--------------modal------------------->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark rounded class="mb-2" v-on="on" :disabled="user.admin==3">New Print</v-btn>
          </template>
          <!----popup---------------->
          <v-card>
            <v-card-title><span class="headline" >{{ formTitle }}</span></v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select single-line bottom label="Saw"  class="select" 
                    required v-model="editedItem.saw"   :items="sawoptions"   item-value='value' item-text='value'
                    > </v-select>
                  </v-col>
                  <v-col cols="4" sm="6" md="6">
                    <v-text-field v-model="editedItem.alias" label="Alias"></v-text-field>
                  </v-col>
                  <v-col cols="4" sm="6" md="6">
                    <v-text-field v-model="editedItem.printer" label="Printer"></v-text-field>
                  </v-col>
                  <v-col cols="4" sm="6" md="6">
                    <v-text-field v-model="editedItem.location" label="Location"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-select single-line bottom label="Type" 
                      v-model="editedItem.instruct" :items="typeOptions"    
                      required
                    >
                  </v-select>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <div class="flex-grow-1"></div>
                <div v-if="dialogDelete === true">
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="remove">Delete</v-btn>
                </div>
                <div v-else-if="dialogDelete === false">
                  <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                  <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                </div>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--------------modal--------------->
      </v-toolbar>
    </template>
    <template v-slot:item.icn="{ item }">
      <v-icon v-bind:style="{ color: 'rgb('+item.red+','+item.green+','+item.blue+')' }" >
                        mdi-flag</v-icon>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon medium color="blue darken-2" class="mr-2" @click="editItem(item)" >mdi-pencil</v-icon>
      <v-icon medium color="red" @click="deleteItem(item)" >mdi-delete</v-icon>
    </template>
    <template v-slot:no-data>
      <div></div> <!----show nothing when no data -->
    </template>
  </v-data-table>
  </div>
</template>
<script>
 import Vue from 'vue';
    import { mapGetters, mapState, mapActions} from 'vuex'
    export default 
    {  data: () => ({
      dialog: false,dialogDelete: false, loading:false,
      typeOptions: [ "JobList",  "JobDetails"],
      headers: [
                        { text: "ID", value: "id", width: "6%" },
                        { text: "NAME", align: "left", sortable: true, value: "name" },
                        { text: "Saw", align: "left", sortable: true, value: "saw" },
                        { text: "Alias", align: "left", sortable: true, value: "alias" },
                        { text: "Printer", align: "left", sortable: false, value: "printer" },
                        { text: "Location", align: "left", sortable: false, value: "location" },
                        { text: "Type", align: "left", sortable: false, value: "instruct" },
                        //{ text: "CREATEDBY", align: "left", sortable: true, value: "createdby.name" },
                        { text: "UPDATEDBY", align: "left", sortable: true, value: "updatedby.name" },
                        { text: "UPDATEDAT", align: "left", sortable: true, value: "updated_at" },
                       // { text: "Actions", value: "action", sortable: false, width: "8%" },
                        { text: 'Actions', value: 'actions', sortable: false,width: "10%" },
      ],
    //  categories: [],
      //sawflags:[],
      editedItem: { name: '', saw: '', printer:'', location:'',alias:'',instruct:''},
      editedIndex: -1,
     // typeOptions: [ "saw_schedules",  "optimised_bars", "optimised_cuts", "Flag" ],
     // formData: {     id: '',    STATUS: '', TYPE:'',   comment: '', }
    }),
        created(){ 
        },
     computed: { 
      formTitle() {  if (this.dialogDelete) { return "Delete Flag";} 
                     else if (this.editedIndex === -1) { 
                                        return "New Print"; }
                    else if (this.editedIndex > -1) { 
                                return "Edit Flag";  }  
                   },
      ...mapState({
            user: state => state.auth.user,
            sawflags:state => state.saw.sawprints,
            sawoptions:state => state.saw.sawoptions
        }),
             },
    
    watch: { dialog (val) { 
                          if(this.user.admin =='3')
                            { this.dialog=false; this.close()
                              swal.fire({ position: 'top-right',
                                                title:'<span style="color:white">Access denied: View only user</span>',
                                                timer: 2000, toast: true, background: 'red',
                                                });
                                                
                              return;
                            }
                          
                          val || this.close()  },    
            },
    methods: { 
      editItem (item) {  
        if(this.user.admin =='3')
        { swal.fire({ position: 'top-right',
                            title:'<span style="color:white">Access denied: View only user</span>',
                            timer: 2000, toast: true, background: 'red',
                            });
          return;
        }
        
        this.dialogDelete = false;
        this.editedIndex = this.sawflags.indexOf(item); 
        this.editedItem = Object.assign({}, item); 
      //  this.editedItem=item;
        this.dialog = true
        },
      save () 
      {  
        if (this.editedIndex > -1) 
                  {  
                    this.$store.dispatch('editsawprint', this.editedItem) 
                        .then((response) => {})     .catch((error) => {});
                    } 

        else {  
                    this.$store.dispatch('addsawprint', this.editedItem) 
                      .then((response) => {})     .catch((error) => {});
            }
                this.close()
        },
        //--------------delete start----------------------------------------------------------
      deleteItem (item) {
              if(this.user.admin =='3')
                { swal.fire({ position: 'top-right',
                                    title:'<span style="color:white">View only user:Access denied</span>',
                                    timer: 2000, toast: true, background: 'red',
                                    });
                  return;
                }
                       // const index = this.desserts.indexOf(item)
                        this.dialogDelete = true;
                        this.editedIndex = this.sawflags.indexOf(item);
                        this.editedItem = Object.assign({}, item);
                        this.dialog = true;
               //after this now press delete on dialogue box to execure below fn
              },
      remove() { 
                  this.$store.dispatch('deletesawprint', this.editedItem)  
                                .then((response) => {})
                                .catch((error) => {});
                             
                 // this.dialogDelete = false;
                  this.close(); 
                },
      //-------------------------------delete finish-----------------
      //------------------close modal---------------------------
      close () {  
                  this.dialog = false; 
                  setTimeout(() => {  
                    this.editedItem = Object.assign({}, this.defaultItem)
                          this.editedIndex = -1 
                          this.dialogDelete = false;}, 100)
              },
    
    },
  }
</script>