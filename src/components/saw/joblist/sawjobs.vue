<template>
 <v-container grid-list-lg pa-0 mt-2>
    <v-layout wrap>
       <v-flex xs12>
         <v-btn  text  color="grey" @click="backToSaw" class="mr-5">
            <v-icon id="return-btn">mdi-keyboard-backspace</v-icon>RETURN TO SAW
         </v-btn>
         <span v-for="(item,index) in sawflags1" class="mr-4" >
             <v-icon v-bind:style="{ color: 'rgb('+item.red+','+item.green+','+item.blue+')' }" >
        mdi-flag</v-icon> 
            - {{ item.name }}
         </span>
       </v-flex>
    <v-flex xs12 pt-0>
         <test-list-view ></test-list-view>
    </v-flex>
  </v-layout>
 </v-container>
</template>
<script>
 import TestListView from './joblist.vue'
 import { mapGetters, mapState, mapActions} from 'vuex';
export default {
   computed: 
      {  ...mapState({ sawlist: state => state.saw.sawlist, 
                        user: state => state.auth.user,
                        sawflags:state => state.saw.sawflags,
                  }),
                          sawflags1(){
            let bb= this.sawflags.filter( x => (x.id !=  6, x.id !=  9)  );
          
            return bb;

        },
      },
      components: { 
      'test-list-view': TestListView,  },
      methods: {   backToSaw() { this.$router.push({name: 'saw'});  },
            },
}
</script>
<style scoped>
#return-btn{

}
</style>