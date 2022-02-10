<template>
    <div id="root-dashboard-main">
        <div class="main">
            <div class="container">
                     <div class="col-lg-6">
                        <div  >
                            <div slot="ibox-content" class="ibox-content">
                                <div class="row-content">
                                    <ticket-type-bar-chart></ticket-type-bar-chart>
                                </div>
                            </div>
                        </div>
                    </div>

            </div>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import { mapGetters, mapState, mapActions} from 'vuex'

  //  import IBox from '../../IBox/IBox.vue'

    import TaskTypeBarChart from '@/store/modules/csticketTypeBarChartUser'
    

    export default 
    {    

        components: { 'ticket-type-bar-chart': TaskTypeBarChart,   },

    }
</script>

<style scoped>
</style>
