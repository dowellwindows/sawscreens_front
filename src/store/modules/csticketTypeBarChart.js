
import { Bar, mixins } from 'vue-chartjs'

export default Bar.extend(
{   mixins: [mixins.reactiveData],
    data () 
    {   return { options: 
                 {  scales: 
                    {  yAxes: [{ ticks: {  beginAtZero: true   }, gridLines: { lineWidth: 1, display: true  }  }],
                       xAxes: [ { gridLines: { lineWidth: 1, display: true }, barPercentage: 1, categoryPercentage: 0.5,    }]
                    },
                    legend: {  display: true    },
                    responsive: true,
                    maintainAspectRatio: false
                 },
                chartData: '',
                labels: [],
                keyRequest: [],
                IncorrectPricing: [],
                ATO: [],
                RectificationReport: [],
                timer: null,
             }
    },
    created () {
        //this.fillData()
        this.taskOverviewBarchart();
    },
    beforeDestroy() {  },
    mounted () {
        this.renderChart(this.chartData, this.options);
        // this.timer = setInterval(() => {
        //     this.taskOverviewBarchart()
        // }, 5000)
    },
    methods: {
        cancelAutoUpdateChart() {  clearInterval(this.timer);   },
        taskOverviewBarchart() 
        {  this.$store.dispatch('csticketTypeBarchart')
                .then((response) => 
                {  this.labels = response.data.labels;
                    this.keyRequest = response.data.keyRequest;
                    this.IncorrectPricing = response.data.IncorrectPricing;
                    this.ATO = response.data.ATO;
                    this.RectificationReport = response.data.RectificationReport;
                    this.PickupDocket = response.data.PickupDocket;
                    this.SDAModification = response.data.SDAModification;
                    this.DowellProblem = response.data.DowellProblem;
                    this.Collect = response.data.Collect;
                    this.SDAMissingPdct = response.data.SDAMissingPdct;
                    this.CashSale = response.data.CashSale;
                    this.fillData();
                })
                .catch((error) => {             });
        },
        fillData () 
        {   this.chartData = 
            { labels: this.labels,
                datasets: [  {   label: 'key Requestg',     backgroundColor:  '#41B883',   data: this.keyRequest,             },
                            {   label: 'Incorrect Pricing',      backgroundColor:  '#DD1B16',     data: this.IncorrectPricing,               },
                            {   label: 'ATO',   backgroundColor:  '#00D800',     data: this.ATO,             },
                            {   label: 'Rectification Report',      backgroundColor:  '#00D8FF',      data: this.RectificationReport,           },
                            {   label:  'Pickup Docket' ,     backgroundColor:  'beige',   data: this.PickupDocket,             },
                            {   label: 'SDA Modification' ,      backgroundColor:  'Aquamarine',     data: this.SDAModification,               },
                            {   label: 'Dowell Problem' ,   backgroundColor:  'LightCyan',     data: this.DowellProblem,             },
                            {   label:   'Collect' ,      backgroundColor:  'fuchsia',      data: this.Collect,           },
                            {   label:  'SDA-Missing Pdct',   backgroundColor:  'lavender',     data: this.SDAMissingPdct,             },
                            {   label: 'Cash Sale',      backgroundColor:  'lightskyblue',      data: this.CashSale,           },
                        ]
            }
        },
    }
})