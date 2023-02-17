<template>
  <v-flex xs12 style="width:95%" class="black--text mb-5">
    <v-data-table :headers="headers" :items="dataList" hide-default-footer :items-per-page="5" class="elevation-1">
      <template v-slot:top>
        <v-card-actions class="pt-3 px-3">
          <v-btn
            color="primary"
            @click="addHomeDialog = true"
            v-if="user.userRole === 5"
            depressed
            dark
          >Thêm căn hộ</v-btn>
          <v-col cols="12" sm="2">
          <v-select
          class="ml-3"
          v-model="statusFilter"
          :items="houseStatus"
          :item-text="houseStatus.text"
          :item-value="houseStatus.value"
          label="Trạng thái"
        ></v-select>
          </v-col>
        </v-card-actions>
      </template>
      <template v-slot:item.image="{ item }">
        <div class="py-2">
          <v-img class="white--text" width="200px" height="120px" :src="item.images[0] !== undefined ? item.images[0].imgUrl : defaultImg"></v-img>
        </div>
      </template>
      <template v-slot:item.statusName="{ item }">
        <span :class="`${item.status === 'inprogress' ? 'red--text' : ''} font-italic`">{{item.statusName}}</span>
      </template>
      <!-- <template v-slot:item.status="{ item }">
        <span class="red--text font-italic">{{item.statusName}}</span>
        <v-chip class="mr-2" dark :color="item.currentContract === undefined ? 'primary' : 'indigo darken-3'" small label>{{item.currentContract === undefined ? 'Đang trống' : 'Đang cho thuê'}}</v-chip>
      </template> -->
      <template v-slot:item.bookingDate="{ item }">
        <span :class="`${item.status === 'inprogress' ? 'red--text' : ''} font-italic`">{{item.bookingDate}}</span>
      </template>
      <template v-slot:item.price="{ item }">
        {{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(item.price)}}
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn text color="blue accent-2" @click="gotoHouseDetails(item)">Xem chi tiết</v-btn>
      </template>
    </v-data-table>
    <v-dialog persistent width="950" v-model="addHomeDialog">
      <v-card>
        <v-card-title class="headline">Thông tin căn hộ</v-card-title>
        <HouseForm @onCloseHouseForm="closeForm" @onCreateHome="createNewHouse" />
      </v-card>
    </v-dialog>
  </v-flex>
</template>

<script>
import Loader from "@/components/Loader";
import { mapState } from 'vuex'
import HouseForm from "@/components/houses/HouseForm";
export default {
  props: {
    content: Object,
    houses: {
      type: Array
    }
  },
  components: {
    Loader,
    HouseForm
  },
  data() {
    return {
      headers: [
        {
          text: "Hình ảnh",
          align: "left",
          sortable: false,
          value: "image"
        },
        { text: "Tên", align: "center", value: "houseName" },
        { text: "Trạng thái", align: "center", value: "statusName", sortable: true},
        { text: "Ngày đặt", align: "center", value: "bookingDate"},
        { text: "Địa chỉ", align: "center", value: "address" },
        { text: "Sức chứa", align: "center", value: "size" },
        { text: "Giá niêm yết / ngày", align: "center", value: "price" },
        { text: "Xem chi tiết", align: "center", value: "action", sortable: false }
      ],
      dates: [],
      addHomeDialog: false,
      houseStatus: [ {text: 'Tất cả', value: 0}, {text: 'Đang trống', value: 1}, {text: 'Đang cho thuê', value: 2},],
      statusFilter: 0,
      dataList: [],
      commingContract: null,
      defaultImg: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg'
    };
  },
  computed: {
    ...mapState({ user: state => state.user }),
  },
  mounted() {
    this.dataList = this.housess
  },
  methods: {
    convertCurrentDate(date) {
      const newDate = new Date(date)
      return this.convertDate(newDate)
    },
    closeForm() {
      this.addHomeDialog = false
    },
    createNewHouse(data) {
      if (data) {
        this.addHomeDialog = false
        this.$emit('onFinishCreateHouse', true)
      }
    },
    gotoHouseDetails(item) {
      this.$router.push(`/dashboard/houses/${item.id}`)
    },
  },
  watch: {
    statusFilter: function() {
      if (this.statusFilter === 0) {
        this.dataList = this.houses
      } else if (this.statusFilter === 1) {
        this.dataList = this.houses.filter(house => {
          return house.currentContract === undefined
        })
      } else {
        this.dataList = this.houses.filter(house => {
          return house.currentContract !== undefined
        })
      }
    },
    houses: function() {
      this.dataList = this.formatListItem(this.houses)
    } 
  }
};
</script>

<style scoped>
</style>
