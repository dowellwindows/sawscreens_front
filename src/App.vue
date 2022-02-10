<template>
 <v-app class="grey lighten-4">
    <TheNavigation/>
    <div v-if="authenticated && user">
    <AutoLogout/>
    </div>
    <v-content class="mx-4 mb-4"><router-view/> </v-content>
 </v-app>
</template>

<script>
  import { mapGetters, mapState, mapActions} from 'vuex'
import TheNavigation from '@/components/TheNavigation'
import AutoLogout from './AutoLogout'
export default {
  components:{TheNavigation, AutoLogout},
   computed:{
        ...mapGetters({authenticated:'auth/authenticated',
                       user:'auth/user'
                      }),
          
    },
}
</script>
<style lang="scss">

</style>
