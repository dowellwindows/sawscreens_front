<template>
    <div class="mt-3">
      <!--  <sawschedules v-bind:bb="aa" :loading="loading"></sawschedules> -->
      <v-progress-linear :active="loading" :indeterminate="loading" absolute   top  color="deep-purple accent-4"
      ></v-progress-linear>
   <v-data-table  :headers="headers" :items="sawflags"  class="elevation-1" >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>SAW Flags</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <!--------------modal------------------->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark rounded class="mb-2" v-on="on" :disabled="user.admin==3">New Flag</v-btn>
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
                    <v-text-field v-model="editedItem.comment" label="Comments"></v-text-field>
                  </v-col>
                  <v-col cols="4" sm="12" md="4">
                    <v-text-field v-model="editedItem.red" label="red"></v-text-field>
                  </v-col>
                  <v-col cols="4" sm="12" md="4">
                    <v-text-field v-model="editedItem.green" label="green"></v-text-field>
                  </v-col>
                  <v-col cols="4" sm="12" md="4">
                    <v-text-field v-model="editedItem.blue" label="blue"></v-text-field>
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
      headers: [
                        { text: "ID", value: "id", width: "6%" },
                        { text: "NAME", align: "left", sortable: true, value: "name" },
                        { text: "FLAG", align: "left", sortable: true, value: "icn" },
                        { text: "RED", value: "red", sortable: true,  },
                        { text: "GREEN", value: "green", sortable: true,  },
                        { text: "BLUE", value: "blue", sortable: true,  },
                        { text: "COMMENTS", align: "left", sortable: false, value: "comment" },
                        { text: "CREATEDBY", align: "left", sortable: true, value: "createdby.name" },
                        { text: "UPDATEDBY", align: "left", sortable: true, value: "updatedby.name" },
                        { text: "UPDATEDAT", align: "left", sortable: true, value: "updated_at" },
                       // { text: "Actions", value: "action", sortable: false, width: "8%" },
                        { text: 'Actions', value: 'actions', sortable: false,width: "10%" },
      ],
    //  categories: [],
      //sawflags:[],
      editedItem: { name: '', red: '', green:'', blue:'',  comment: '',   },
      editedIndex: -1,
      typeOptions: [ "saw_schedules",  "optimised_bars", "optimised_cuts", "Flag" ],
     // formData: {     id: '',    STATUS: '', TYPE:'',   comment: '', }
    }),
        created(){ 
        },
     computed: { 
      formTitle() {  if (this.dialogDelete) { return "Delete Flag";} 
                     else if (this.editedIndex === -1) { 
                                        return "New Flag"; }
                    else if (this.editedIndex > -1) { 
                                return "Edit Flag";  }  
                   },
      ...mapState({

            sawflags:state => state.saw.sawflags,
            user: state => state.auth.user,
        }),
             },
    
    watch: { dialog (val) { 
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
        this.dialog = true
        },
      save () 
      {  
        if (this.editedIndex > -1) 
                  {  
                    this.$store.dispatch('editflag', this.editedItem) 
                        .then((response) => {})     .catch((error) => {});
                    } 

        else {  
                    this.$store.dispatch('addflag', this.editedItem) 
                      .then((response) => {})     .catch((error) => {});
            }
                this.close()
        },
        //--------------delete start----------------------------------------------------------
      deleteItem (item) {
              if(this.user.admin =='3')
        { swal.fire({ position: 'top-right',
                            title:'<span style="color:white">Access denied: View only user</span>',
                            timer: 2000, toast: true, background: 'red',
                            });
          return;
        }
                    this.dialogDelete = true;
                    this.editedIndex = this.sawflags.indexOf(item);
                    this.editedItem = Object.assign({}, item);
                    this.dialog = true;
              },
      remove() { 
                  this.$store.dispatch('deleteflag', this.editedItem)  
                                .then((response) => {})
                                .catch((error) => {});
                  this.close(); 
                },

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