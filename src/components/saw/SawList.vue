<template>
 <div >
    <v-layout row wrap class="justify-center">
      <div v-for="aaa in aa" >
        <v-btn class="primary dark" id="button3" :loading="loading" @click.prevent="getjobs(aaa)"> {{aaa.SawCode.replace(/_/g, " ")}}</v-btn>
      </div>
    </v-layout>
 
   </div>  
</template>
<script>
import Vue from 'vue'
import { mapGetters, mapState, mapActions} from 'vuex';
import axios from "axios";
export default
{  computed: 
   { //...mapState({ sawlist: 'saw/sawlist', }),
    // ...mapActions({getsaws:'saw/getsaws'}),
        ...mapState({ sawlist: state => state.saw.sawlist, 

              }),
        ...mapGetters({authenticated:'auth/authenticated',
                      user:'auth/user'
                      }),
        aa() { if (this.sawlist)  
                        { 
                            return this.sawlist;
                        }
              }
            },
  data() { return { loading: false, 
                    formData: {  SawCode:'', Location:'',},
                  }  
          },
  methods: {  

              getjobs(data)
                {  this.loading=true;
                   // this.$router.push({name: 'sawjobs', params: {  myProperty: data.SawCode  }});
                  this.$store.dispatch('selectedSaw', data);
                  this.formData.SawCode = data.SawCode;
                  this.formData.Location = data.Location;
                  this.$store.dispatch('getJobs', this.formData)
                  .then((res) => {  this.loading=false;
                                      
                    this.$router.push({name: 'joblist'});           
                                  })
                  .catch((error) => {
                  });


                }           
          },

}
</script>

<style scoped>
#button3 {
padding: 2rem;
height: 6rem; width: 10rem;
border-radius: 1rem;
margin-top:3rem; margin-right:2rem;
background-color: #237fbc; border-color: #237fbc;
color: white;  
font-family: Open Sans, Helvetica,Arial,sans-serif;
font-size: .8rem;  
display: inline-block;
zoom: 1; 
color: #fff; 
text-align: center;
white-space: normal;

}

#button3:hover {background-color: rgb(23, 227, 241) !important; color:#237fbc}
#button3:active{ top: 3px; outline: none; -webkit-box-shadow: none; box-shadow: none;}
</style>