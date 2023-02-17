  
<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" @click="setToday">
            Hôm nay
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn fab text small @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
        v-model="focus"
          ref="calendar"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :event-margin-bottom="3"
          :now="today"
          locale="vi-VN"
          @click:event="showEvent"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          full-width
          offset-x
        >
          <v-card
            min-width="350px"
            flat
          >
            <v-toolbar
              color="primary"
              dark
            >
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <span>Giá thuê: {{selectedEvent.rentalFee}}</span><br/>
              <span>Đặt cọc: {{selectedEvent.deposit}}</span><br/>
              <span>Thời gian: {{selectedEvent.time}}</span><br/>
              <span>Trạng thái: {{selectedEvent.status}}</span>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="selectedOpen = false"
              >
                Đóng
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
  import {RepositoryFactory} from '@/repository/RepositoryFactory'
  const contractRepository = RepositoryFactory.get('contract')
  export default {
    props: {
      isChangeContracts: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Month',
        week: 'Week',
        day: 'Day',
        '4day': '4 Days',
      },
      start: null,
      end: null,
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
    }),
    computed: {
      today() {
        return this.convertDateForPicker(new Date());
      },
      title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }
        const startMonth = this.monthFormatter(start)
        const endMonth = this.monthFormatter(end)
        const suffixMonth = startMonth === endMonth ? '' : endMonth
        const startYear = start.year
        const endYear = end.year
        const suffixYear = startYear === endYear ? '' : endYear
        const startDay = start.day + this.nth(start.day)
        const endDay = end.day + this.nth(end.day)
        switch (this.type) {
          case 'month':
            return `${startMonth} ${startYear}`
          case 'week':
          case '4day':
            return `${startMonth} ${startDay} ${startYear} - ${suffixMonth} ${endDay} ${suffixYear}`
          case 'day':
            return `${startMonth} ${startDay} ${startYear}`
        }
        return ''
      },
      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    mounted () {
      this.$refs.calendar.checkChange()
      this.getContracts()
    },
    methods: {
      async getContracts() {
        let houseId = this.$route.params.id
        const {data} = await contractRepository.getContractsByHouse(NaN, NaN, '', houseId)
        let listContract = this.formatListContracts(data.result.data)
        console.log(listContract)
        this.events = listContract.map(contract => {
          return {
            name: contract.customer.cusName,
            start: this.convertDateForPicker(contract.startDate),
            end: this.convertDateForPicker(contract.endDate),
            rentalFee: contract.rentalFee,
            deposit: contract.deposit,
            color: contract.color,
            status: contract.statusName,
            time: `${this.convertDate(contract.startDate)} (${this.convertTime(contract.startDate)}) ~ 
            ${this.convertDate(contract.endDate)} (${this.convertTime(contract.endDate)})`
          }
        })
        console.log(this.events)
      },
      getEventColor (event) {
        return event.color
      },
      setToday () {
        this.focus = this.today
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }
        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
        this.start = start
        this.end = end
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },
    },
    watch: {
      isChangeContracts: function() {
        console.log("changeInfo")
        if (this.isChangeContracts) {
          console.log("changeInfo")
          this.getContracts()
        }
      }
    }
  }
</script>