<template>
  <v-data-table  :headers="headers" :items="computeduser"  class="elevation-1"
  :hide-default-footer="true"  >
   <template v-slot:item.mobile1="{ item }">
      {{ usertype }}
    </template>
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>User Profile</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <!--------------modal------------------->
        <v-dialog v-model="dialog" max-width="500px" >
          <template v-slot:activator="{ on }">
           <!-- <v-btn color="primary" dark rounded class="mb-2" v-on="on">New User</v-btn> -->
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
                    <v-text-field v-model="editedItem.email" label="Email" disabled
                     ></v-text-field>
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
                </v-row>
                </v-form>
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
    <template v-slot:item.actions="{ item }">
      <v-icon medium color="blue darken-2" class="mr-2" @click="editItem(item)" >mdi-pencil</v-icon>

    </template>
    <template v-slot:no-data>
      <div></div> <!----show nothing when no data -->
    </template>
  </v-data-table>
</template>
<script>
    import { mapGetters, mapState, mapActions} from 'vuex'
  export default {
    data: () => ({
      dialog: false,dialogDelete: false,
      headers: [
                       // { text: "ID", value: "id", width: "6%" },
                        { text: "NAME", align: "left", sortable: true, value: "name" },
                        { text: "EMAIL", align: "left", sortable: true, value: "email" },
                        { text: "TYPE", align: "left", sortable: true, value: "mobile1" },
                       // { text: "TYPE", align: "left", sortable: true, value: "type" },
                       // { text: "CREATEDBY", align: "left", sortable: true, value: "created_by.name" },
                       // { text: "UPDATEDBY", align: "left", sortable: true, value: "updated_by" },
                       // { text: "UPDATEDAT", align: "left", sortable: true, value: "updated_at" },
                       // { text: "Actions", value: "action", sortable: false, width: "8%" },
                        { text: 'Edit', value: 'actions', sortable: false,width: "10%" },
      ],
      desserts: [],categories: [],
      editedItem: { name: '', email: '', type:'',   password: '', confirm_password: '', mobile:''},
      editedIndex: -1,
      typeOptions: [ "Admin",  "Normal" ],
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
                                return "Edit User";  }  
                              },
         ...mapState({  sawstatus:state => state.user.userlist
         
         }),
         computeduser () 
              { 
                    return this.sawstatus.filter(sawstatus => sawstatus.email == this.user.email)

              },
          ...mapGetters({authenticated:'auth/authenticated',
                          user:'auth/user'
                        }),
                    usertype(){
                     
                        if(this.user.admin==1){ return "Admin User"; }
                        else if (this.user.admin==3) {return "View User";}
                        else if (this.user.admin==4) {return "Super User";}
                        else{ return "Saw User"}
                      },
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

      editItem (item) { 
        this.dialogDelete = false;
        this.editedIndex = this.sawstatus.indexOf(item); 
        this.editedItem = Object.assign({}, item); 
      
        this.dialog = true
        },
      save () 
      { 
        if (this.editedIndex > -1) 
              {  
                  

                      this.editedItem.type=this.computeduser[0].mobile;
                    
                    if (!this.$refs.userform.validate()) 
                    {   
                    
                      return false; 
                    }
                    else
                    { 
                    this.$store.dispatch('edituser', this.editedItem) 
                    }
                } 
            //this.reseteditedItem();
            this.close()
        },
        //--------------delete start----------------------------------------------------------
      //-------------------------------delete finish-----------------
      //------------------close modal---------------------------
      close () {  this.dialog = false
                  setTimeout(() => {  this.editedItem = Object.assign({}, this.defaultItem)
                          this.editedIndex = -1, this.dialogDelete = false; }, 100)
              },
    
    },
  }
</script>