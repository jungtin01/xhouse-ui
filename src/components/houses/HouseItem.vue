<template>
  <v-flex xs12 style="width:95%" class="black--text mb-5">
    <v-card class="mx-auto house-item" max-width="400">
      <v-layout column v-if="isEmpty">
        <v-sheet height="200px" style="display:flex" color="grey lighten-3">
          <v-btn @click="addHomeDialog = true" color="grey lighten-2" depressed fab x-large dark class="btn-add-house">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-sheet>
        <v-sheet
          height="200px"
          style="border-bottom-left-radius:4px;border-bottom-right-radius:4px"
        >
          <v-card-text>
            <p class="mt-4 mb-2 headline text-center font-weight-bold">Thêm căn hộ</p>
            <p class="body-2 text-center">Thêm căn hộ của bạn</p>
          </v-card-text>
        </v-sheet>
      </v-layout>
      <v-layout v-if="!isEmpty" column>
        <v-img
          class="white--text"
          height="200px"
          :src="content.images[0] !== undefined ? content.images[0].imgUrl : defaultImg"
          style="border-top-left-radius: 4px;border-top-right-radius:4px"
        >
          <v-card-title class="align-end fill-height">{{content.houseName}}</v-card-title>
        </v-img>
        <v-sheet
          height="200px"
          style="border-bottom-left-radius:4px;border-bottom-right-radius:4px"
        >
          <v-card-text>
            <v-chip class="mr-2" dark color="indigo darken-3" small label>{{content.statusName}}</v-chip>
            <span class="red--text font-italic">{{content.bookingDate}}</span>
            <p class="mt-4 mb-2 body-1">{{content.address}}</p>
            <p class="body-2">{{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(content.price)}} <i>Sức chứa: {{content.size}}</i></p>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="gotoHouseDetails" text color="blue accent-2">Xem chi tiết</v-btn>
          </v-card-actions>
        </v-sheet>
      </v-layout>
    </v-card>
    <v-dialog persistent width="800" v-model="addHomeDialog">
      <v-card>
        <v-card-title class="headline">Thông tin căn hộ</v-card-title>
        <HouseForm @onCloseHouseForm="closeForm" @onCreateHome="createNewHouse" />
      </v-card>
    </v-dialog>
  </v-flex>
</template>

<script>
import Loader from "@/components/Loader";
import HouseForm from "@/components/houses/HouseForm";
export default {
  props: {
    content: Object,
    isEmpty: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Loader,
    HouseForm
  },
  data() {
    return {
      addHomeDialog: false,
      dates: [],
      defaultImg: 'https://cdn.vuetifyjs.com/images/cards/docks.jpg'
    };
  },
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {
    closeForm() {
      this.addHomeDialog = false
    },
    createNewHouse() {
      this.addHomeDialog = false
      this.$emit('onFinishCreateHouse', true)
    },
    gotoHouseDetails() {
      this.$router.push(`/dashboard/houses/${this.content.id}`)
    }
  }
};
</script>

<style scoped>
.btn-add-house {
  display: flex;
  flex: inherit;
  margin: auto;
}
</style>
