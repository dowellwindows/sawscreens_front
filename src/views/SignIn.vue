<template>
 
        <v-container fill-height fluid >
         <v-layout wrap >
           <v-flex lg6 md6  class="d-none d-md-flex svg1"  >  
           <!--  <v-flex lg6 md6  class="hidden-sm-and-down svg1">     -->    
                   <v-img  src="../assets/graphic.svg" alt="" style="width: 20rem; height: 30rem;"> </v-img>
            </v-flex>
           <v-flex class="zz1 lg6 md6 sm12 " >
              <v-hover v-slot:default="{ hover }">
              <v-card :elevation="hover ? 12 : 2" color="grey lighten-4" class="mx-auto ">
              <v-toolbar color="blue lighten-2"  dark >
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer />
              </v-toolbar>
              <v-card-text >
                <v-form color="grey lighten-2" @submit.prevent="submit" ref="loginForm" :value="formValid" >
                  <v-text-field label="E-mail" :rules="emailRules" name="login" prepend-icon="mdi-email" type="text" v-model="form.email"/>
                  <v-text-field :type="showPassword ? 'text':'password'" id="password" :rules="passwordRules" label="Password" name="password" v-model="form.password"
                     prepend-icon="mdi-lock"  :append-icon="showPassword ? 'mdi-eye':'mdi-eye-off'" @click:append="showPassword=!showPassword" />
                  <v-spacer />
                   <v-layout column wrap justify-end align-end >
                       <v-card-text class="text-md-right text-sm-center text-xs-center">
                           <v-btn type="submit" :loading="loading" rounded color="teal lighten-2" dark >Submit</v-btn>
                        </v-card-text>
                    </v-layout>
                </v-form>
              </v-card-text>
              
            </v-card>
             </v-hover>
           </v-flex>

          </v-layout>
      
      
      </v-container>

</template>

<script>

//import {mapGetters, mapActions} from 'vuex'
import {mapActions} from 'vuex';
import navi1 from '@/components/TheNavigation';
export default 
{  //import axios from 'axios';

  name: 'signin',
  components: { navi1 },
  data(){return {form:{email:'',password:''}, showPassword:false,aalert:true, loading:false,
                    emailRules: [ v => !!v || 'The Email is required',
                                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',],
                  passwordRules: [ v => !!v || 'The Password is required' ],
                  formValid:false,
              }},
  methods: { 
        ...mapActions({signIn:'auth/signIn'}),
         submit()
            { 
              if(this.$refs.loginForm.validate())
              {
              this.loading=true;
              this.signIn(this.form).then(()=>
              { this.loading=false;
               // toast.fire({   icon: "success", title: "Login Success" })
                swal.fire({
                position: 'top-right',
                title:'<span style="color:white">Login Success!!</span>',
                  timer: 2000,toast: true, background: 'purple', color:'white'
                // customClass: 'swal2-popup',
                 });

                this.$router.replace({name:'dashboard'})
              }).catch(()=>{
                               //swal.fire("Login Failed","There was an error logging in. Please try again!","warning");
                               swal.fire({
                position: 'top-right',
                title:'<span style="color:white">Login Failed!!</span>',
                  timer: 5000, toast: true, background: 'red', color:'white'
                 });
                              this.loading=false;
                              })
              }
                              
            }    
    }
}

</script>

<style scoped>
.zz1{

    padding-top: 4rem;
    padding-right: 3rem;
    padding-left: 3rem;

}
.svg1:hover{  transform: scale(1.1)}
.svg1{width:100%; height:auto; transition:all 1s ease}
@media(min-width:600px) and (max-width:874px){
.zz1{

    padding-top: 5rem;
    padding-right: 4rem;
    padding-left: 4rem;

}
}

/* potrait mode */
@media(max-width:600px){
.zz1{

    padding-top: 1rem;
    padding-right: 0rem;
    padding-left: 0rem;

}

}

</style>
