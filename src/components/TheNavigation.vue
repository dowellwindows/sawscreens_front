<template>
    <nav>
         
          <v-app-bar flat app ><!--toolbar  -->
            <div v-if="authenticated && user">
                <v-app-bar-nav-icon class="grey--text" @click="drwr = !drwr"></v-app-bar-nav-icon>
            </div>

            <!--  <router-link class="logoimg" to="/"> -->
            <img src="../assets/dowell.png" class="logoimg" alt="Dowell Windows and Doors">
            <!--  </router-link> -->
            <v-toolbar-title class="transparent"> 
                <span class="font-weight-light">Sawyer</span><span>Screen</span>
            </v-toolbar-title>
  
            <v-spacer></v-spacer>
            <div v-if="authenticated">
                <v-btn text color="grey" @click.prevent="signOut"> Sign Out
                <v-icon >mdi-logout-variant</v-icon>  </v-btn>
            </div>
            <div v-else>
                  <v-btn text color="grey"> 
                      <router-link :to="{name:'login'}"></router-link>
                   </v-btn>
            </div>
        </v-app-bar><!-- toolbar finish --drawer start-->
        <div v-if="authenticated">
            <div snackbar="true" > </div>
            <v-navigation-drawer v-model="drwr" app dark  
             id="sidebar">
               <v-layout column align-center>
                    <v-flex class="mt-5" >
                         <v-avatar size="120" class="mb-2"><img src="@/assets/user.png"></v-avatar>
                         <p class="mt-2" style="text-align: center; color:rgb(6, 231, 125);"
                         >{{user.name}}</p>
                         <p style="text-align: center; color:rgb(6, 231, 125); margin-top: -1rem;"
                         >{{usertype}}</p>
                    </v-flex> <!--popup to add projects below -->
               </v-layout>            
      <!---multi leve finish ---------->
    <v-list dense >
  
     <!--- -->
       <template v-for="(item, index) in items">
		      <template v-if="item.hasMulSub">
			       <v-list-group :value="false" :prepend-icon="item.action"  :key="index"  no-action
              color="white" >
                <template v-slot:activator >
                  <v-list-item-content  >
                    <v-list-item-title v-text="item.title"></v-list-item-title>
                  </v-list-item-content>
                </template>             

              <v-list-item v-for="subItem in item.items" :key="subItem.title"
               router-link :to="subItem.route" color="white"> 
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.title" ></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
          
          </v-list-group>
          </template>
		    <template v-else>
          <v-list-item  router-link :to="item.route" :key="index" no-action color="white">
            <v-list-item-action><v-icon>{{ item.action }}</v-icon></v-list-item-action>
            <v-list-item-content> <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
	    </template>
       <!---- -->          
    </v-list>
          </v-navigation-drawer>
      </div>
    </nav>
 </template>

<script>

import {mapGetters, mapActions} from 'vuex'

export default {
  
     data(){return{ drwr:false, 
     
      items: [
          { action: 'mdi-view-dashboard', title: 'Dashboard', route:'/',hasMulSub: false },
          // { action: 'mdi-account', title: 'User Profile',route:'/user', hasMulSub: false },
           { action: 'mdi-account', title: 'User Settings',hasMulSub: true,items: [
          //  { title: 'Profile', route:'/profile' },
              { title: 'Users List', route:'/userlist' },
              { title: 'Profile', route:'/profile' },
             //  { title: 'User Rights', route:'/userrights' },

             ],
          },
          { action: 'mdi-hand-saw', title: 'SAW Settings',hasMulSub: true,items: [
              { title: 'Saw Schedules', route:'/sawschedules' },
              // { title: 'Saw Bars', route:'/sawbars' },
              // { title: 'Saw Cuts', route:'/sawcuts' },
               { title: 'Saw Status', route:'/sawstatus' },
               { title: 'Saw Flags', route:'/sawflags' },
               { title: 'Saw Prints', route:'/sawprints' },
               { title: 'Transfrd Jobs', route:'/transfrdjobs' },
               { title: 'Transfr Saw', route:'/transfrsaw' },
             ],
          },
           { action: 'mdi-chart-bar', title: 'Summary',hasMulSub: true, items: [ 
              { title: 'Job summary', route:'/summary/jobs' },
              { title: 'Screens summary', route:'/summary/screens' },
              //{ title: 'dailycuts', route:'/dailycuts' }, 
              ], },
       /*   { action: 'mdi-folder', title: 'NSW',hasMulSub: true,items: [
              { title: 'Smithfield' },
              { title: 'Nowra' },
              { title: 'Beresfield' },
            ],
          },
          { action: 'mdi-folder', title: 'SA', hasMulSub: true,items: [ { title: 'Elizabeth', route:'eli' }, ], },
          { action: 'mdi-folder', title: 'VIC', hasMulSub: true,items: [{ title: 'Bayswater' },], },
          */
          
        ],
      } //return complete
    },
    computed:{
        ...mapGetters({authenticated:'auth/authenticated',
                      user:'auth/user'
                      }),
                   usertype(){
                  
                        if(this.user.admin==1){
                          return "Admin User";
                        }
                        else if (this.user.admin==3) {return "View User";}
                        else if (this.user.admin==4) {return "Super User";}
                        else{ return "Saw User"}
                      }
          
    },
    methods:{
        ...mapActions({signOut1:'auth/signOut'}),
        signOut(){
            this.signOut1().then(()=>{
                this.$router.replace({path:'/login'})
                toast.fire({ icon: "success", title: "Logout Success" });
                  swal.fire({
                position: 'top-right',
                title:'<span style="color:white">Logout Success!!</span>',
                  timer: 2000,
                  toast: true,
                  background: 'purple',
                  color:'white'
                });
            })
        },
    },
    
}
</script>
<style scoped>
  #sidebar{
    background-color:#0747A6 !important;
  }
.v-application a {  text-decoration: none; color:black}

#dashboard-l:hover{
background-color:rgb(123,196,189)
}
#dashboard-l:active{
background-color:rgb(123,196,189)
}
#dashboard-l:focus{
background-color:rgb(123,196,189)
}
.v-icon notranslate theme--light{
  color:white;
}
#anid .v-list-item__icon .v-list-group__header__prepend-icon .v-icon {color: white !important;}

.logoimg{
padding-right:10px;
}
</style>