<template>
    <div class="mt-1">
      <!--  <sawschedules v-bind:bb="aa" :loading="loading"></sawschedules> -->
      <v-progress-linear :active="loading" :indeterminate="loading" absolute top color="deep-purple accent-4"></v-progress-linear>
 <v-data-table
    :headers="headers"
    :items="categories"
    :hide-default-footer="true" 
    class="elevation-1 category-table"
    style="margin-top: 10px; "
  >
    <template v-slot:top>
      <v-toolbar flat color="light-blue lighten-5">
          <v-toolbar-title>SAW</v-toolbar-title>
          <v-divider class="mx-4" inset vertical ></v-divider>
          <v-toolbar-title>STATUS</v-toolbar-title>
        <div class="flex-grow-1"></div>
<!-- modal start -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="success" dark class="mb-2" v-on="on">NEW STATUS</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span style="margin-bottom: 40px;" class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field style="width: 440px;"
                      v-model="editedItem.id"  label="Category Id:"  outlined
                    ></v-text-field>
                    <v-text-field   style="width: 440px;"
                      v-model="editedItem.name"  label="Category name:"   outlined
                    ></v-text-field>
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
        <!-- ---------modal finish----------->
      </v-toolbar>
    </template>
<!-------top bar finish----------->
<template slot="no-data">
  <div>
     <!-- <v-progress-linear :active="loading" :indeterminate="loading"  
      color="green accent-4"></v-progress-linear> -->
      <v-progress-circular  :rotate="360"  :size="100"   :width="15"  :active="loading" :indeterminate="loading"  color="blue lighten-4" > </v-progress-circular>
  </div>
</template>
    <template v-slot:item.action="{ item }">
      <v-icon medium color="blue darken-2" class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
      <v-icon medium color="red " @click="deleteItem(item)">mdi-delete</v-icon>
    </template>
  </v-data-table>
  </div>
</template>
<script>
 import Vue from 'vue';
    import { mapGetters, mapState, mapActions} from 'vuex'
   // import sawschedules from './sawbarlist.vue'
    export default 
    {   data(){return{aa:[], loading:false,
                        dialogDelete: false,
                        dialog: false,
                        headers: [
                        { text: "ID", value: "id", width: "6%" },
                        { text: "STATUS", align: "left", sortable: true, value: "STATUS" },
                        { text: "TYPE", value: "TYPE", sortable: true, width: "8%" },
                        { text: "COMMENTS", align: "left", sortable: false, value: "comment" },
                        { text: "CREATEDBY", align: "left", sortable: true, value: "createdby.name" },
                        { text: "UPDATEDBY", align: "left", sortable: true, value: "updatedby.name" },
                        { text: "UPDATEDAT", align: "left", sortable: true, value: "updated_at" },
                        { text: "Actions", value: "action", sortable: false, width: "8%" }
                        ],
                        categories: [],
                        editedIndex: -1,  // New Category
                        editedItem: { id: 0,  name: ""  },
                        defaultItem: { id: 0, name: "" }
                }
    
            },
computed: {  formTitle() {  if (this.dialogDelete) {  return "Delete Category"; } 
                                else if (this.editedIndex === -1) { return "New Category"; } 
                                else if (this.editedIndex > -1) {return "Edit Category"; }  
                            }
        },
components: { 'sawschedules': sawschedules, },
created(){ this.loading=true;
            this.$store.dispatch('getuserlist')
                    .then((res) => { 
                                this.categories=res.data;
                                this.loading=false;
                        })
        },
methods:{
    editItem(item) { 
                    this.dialogDelete = false;
                    this.editedIndex = this.categories.indexOf(item);
                    this.editedItem = Object.assign({}, item);
                    this.dialog = true;
                },
    deleteItem(item) {
      this.dialogDelete = true;
      this.editedIndex = this.categories.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.dialogDelete = false;
      }, 300);
    },

    save() {
      if (this.editedIndex > -1) {  // Edited save
        Object.assign(this.categories[this.editedIndex], this.editedItem);
      } else {  // New save
        this.categories.push(this.editedItem);
      }
      this.close();
    },

    remove() {
      this.categories.splice(this.editedIndex, 1);
      this.close();
    }
        },

          watch: {
    dialog(val) {
      val || this.close();
    }
  },
    }

</script>
<style>

</style>