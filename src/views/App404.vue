<template>
  <v-app>

      <v-container fluid fill-height >
        <v-layout align-center>
          <v-flex text-xs-center class="up">
            <div  class="display-2"
              :class="[$style.errorHint]"> Whoops, 404</div>
            <p :class="[$style.errorText]">Page Not Found</p>
             <div v-if="authenticated">
                <v-btn rounded dark color="primary" :to="todashboard"> Back to Dashboard </v-btn>
              </div>
             <div v-else>
                   <v-btn rounded dark color="primary" :to="to">  Back to login</v-btn>
               </div>
          </v-flex>
        </v-layout>
      </v-container>

  </v-app>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  props: {
    to: { type: String, default: '/login', },
     todashboard: { type: String, default: '/', },
  },
  computed:{
        ...mapGetters({authenticated:'auth/authenticated',
                       user:'auth/user'
                      })
    },
};
</script>

<style lang="scss" module>
.errorHint {
  color: #42a5f5;
  margin-bottom: 10px;
}

.errorText {
  color: #222;
  font-size: 20px;
  line-height: 24px;
  margin-bottom: 10px;
}
</style>
