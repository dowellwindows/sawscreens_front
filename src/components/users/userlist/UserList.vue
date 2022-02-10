<template>
<div>
<div v-if="user.admin =='1'">
  <v-data-table  :headers="headers" :items="sawstatus" :search="search" class="elevation-1" >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>User List</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
                <v-text-field v-model="search" class="serc" append-icon="mdi-magnify" label="Search" single-line hide-details
                ></v-text-field>&nbsp;
        <!--------------modal------------------->
        <v-dialog v-model="dialog" max-width="500px" >
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark rounded class="ml-5 mr-5 mb-2" v-on="on">New User</v-btn>
          </template>
          <!----popup---------------->
          <v-card>
            <v-card-title><span class="headline" >{{ formTitle }}</span></v-card-title>
            <v-card-text>
              <v-container>
                <v-form ref="userform">
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="editedItem.name" label="Name" :rules="requiredRules"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="editedItem.email" label="Email" 
                    :rules="emailRules" ></v-text-field>
                  </v-col>
                 
                    <v-col cols="12" sm="6" md="6" v-if="dialogDelete === false">
                      <v-text-field :rules="passwordRules"
                     v-model="editedItem.password" label="Password" type="password" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" v-if="dialogDelete === false">
                      <v-text-field  v-model="editedItem.confirm_password" label="Confirm Password" 
                      type="password" :rules="[(editedItem.confirm_password === editedItem.password) || 
                      'Passwords  not matching']" ></v-text-field>
                    </v-col>
                 
                <!--   <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="editedItem.mobile" label="Mobile"></v-text-field>
                  </v-col> -->
                  <v-col cols="12" sm="6" md="6">
                    <v-select single-line bottom label="Type" 
                      v-model="editedItem.type" :items="typeOptions"    
                      :rules="[(v) => !!v || 'You must agree to continue!']"
                     required
                    ></v-select>
                  </v-col>
                </v-row>
                </v-form>
              </v-container>
            </v-card-text>

           <!-- <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions> -->
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
    <template v-slot:item.actions="{ item }">
      <v-icon medium color="blue darken-2" class="mr-2" @click="editItem(item)" >mdi-pencil</v-icon>
      <v-icon medium color="red" @click="deleteItem(item)" >mdi-delete</v-icon>
    </template>
    <template v-slot:item.mobile1="{ item }">
       <span v-if="item.mobile ==1">Admin User</span>
       <span v-if="item.mobile ==3">View User</span>
       <span v-if="item.mobile ==2 || item.mobile ==''" >Saw User</span>
       <span v-if="item.mobile ==4" >Super User</span>
    </template>
    <template v-slot:no-data>
      <div></div> <!----show nothing when no data -->
    </template>
  </v-data-table>
  </div>
  <div v-else class="text-center pt-5"> <h3>Accessible only to Admin Users</h3></div>
  </div>
</template>
<script>
    import { mapGetters, mapState, mapActions} from 'vuex'
  export default {
    data: () => ({
      dialog: false,dialogDelete: false,search: '',
      headers: [
                      //  { text: "ID", value: "id", width: "6%" },
                        { text: "NAME", align: "left", sortable: true, value: "name" },
                        { text: "EMAIL", align: "left", sortable: true, value: "email" },
                        { text: "TYPE", align: "left", sortable: true, value: "mobile1" },
                       // { text: "TYPE", align: "left", sortable: true, value: "type" },
                       // { text: "CREATEDBY", align: "left", sortable: true, value: "created_by.name" },
                       // { text: "UPDATEDBY", align: "left", sortable: true, value: "updated_by" },
                       // { text: "UPDATEDAT", align: "left", sortable: true, value: "updated_at" },
                       // { text: "Actions", value: "action", sortable: false, width: "8%" },
                        { text: 'Actions', value: 'actions', sortable: false,width: "10%" },
      ],
      desserts: [],categories: [],
      editedItem: { name: '', email: '', type:'',   password: '', confirm_password: '', mobile:''},
      editedIndex: -1,
      typeOptions: [ "Admin",  "Saw" , "View", "Super"],
      requiredRules: [ v => !!v || 'This field is required'        ],
      emailRules:[ v => !!v || 'The Email is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                  ],
      passwordRules:[  v => !!v || 'The Password is required',
                      v => (v && v.length > 5) || 'The Password must be atleast 6 chars'
                    ]
    }),

    computed: {
      formTitle() {  if (this.dialogDelete) { return "Delete User";} 
                    else if (this.editedIndex === -1) { 
                                        return "New User"; }
                    else if (this.editedIndex > -1) { 
                                return "Edit User";  
                                
                                }  
                  },
         ...mapState({  sawstatus:state => state.user.userlist}),
          ...mapGetters({authenticated:'auth/authenticated',
                          user:'auth/user'
                        })

     },
    watch: { dialog (val) { 
                          val || this.close()  },    
        },
    methods: { 
                  passwordValidator() 
                  { return (this.editedItem.confirm_password === this.editedItem.password) || 
                      'Password not matching';                    
                  },
      reseteditedItem(){
        this.editedItem= { name: '', email: '', type:'',   password: '', confirm_password: '', mobile:''}
      },

      editItem (item) 
      { 
        this.dialogDelete = false;
        this.editedIndex = this.sawstatus.indexOf(item); 
        this.editedItem = Object.assign({}, item); 

        if(this.editedItem.mobile==1) this.editedItem.type="Admin";
        else if(this.editedItem.mobile==2) this.editedItem.type="Saw";
        else if(this.editedItem.mobile==3) this.editedItem.type="View";
        else if(this.editedItem.mobile==4) this.editedItem.type="Super";
      //  this.editedItem=item;
        this.dialog = true
        },
      save () 
      {  
        if (this.editedIndex > -1) //save clicked when editing
              {  
                      if(this.editedItem.type=="Admin") this.editedItem.mobile=1;
                      else if(this.editedItem.type=="Saw") this.editedItem.mobile=2;
                      else if(this.editedItem.type=="View") this.editedItem.mobile=3;
                      else if(this.editedItem.type=="Super") this.editedItem.mobile=4;
                    if (!this.$refs.userform.validate()) 
                    {   
                      
                      return false; 
                    }
                    else
                    { 
                    this.$store.dispatch('edituser', this.editedItem) 
                    }
                } 
           //--------save clicked when adding new
        else { 
                      if(this.editedItem.type=="Admin") this.editedItem.mobile=1;
                      else if(this.editedItem.type=="Saw") this.editedItem.mobile=2;
                      else if(this.editedItem.type=="View") this.editedItem.mobile=3;
                      else if(this.editedItem.type=="Super") this.editedItem.mobile=4;
                     if (!this.$refs.userform.validate()) 
                    {   
                    
                       return false; 
                     }
                    else
                        this.$store.dispatch('adduser', this.editedItem) 
            }
            //this.reseteditedItem();
            this.close()
        },
        //--------------delete start----------------------------------------------------------
      deleteItem (item) {
                        if(this.user.email==item.email)
                        { 
                          return false;
                        }
                        //return false;
                        this.dialogDelete = true;
                        this.editedIndex = this.sawstatus.indexOf(item);
                        this.editedItem = Object.assign({}, item);
                        this.dialog = true;
               //after this now press delete on dialogue box to execure below fn
              },
      remove() { 
                    this.$store.dispatch('deleteuser', this.editedItem) 
                      .then((response) => {})     .catch((error) => {});
                  this.close();
                },
      //-------------------------------delete finish-----------------
      //------------------close modal---------------------------
      close () {  this.dialog = false
                  setTimeout(() => {  this.editedItem = Object.assign({}, this.defaultItem)
                          this.editedIndex = -1, this.dialogDelete = false; }, 100)
              },
    
    },
  }
</script>