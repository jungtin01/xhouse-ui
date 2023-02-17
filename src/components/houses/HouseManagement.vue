<template>
  <v-container>
    <PageTitle class="mb-5" @searchModel="searchHouseByName" :searchItems="searchItems" :isLoading="isLoading" :title="'Quản lý căn hộ'" :label="'Tìm căn hộ'" @searchAutoComplete="handleSearchAutoComplete" @search="handleSearch($event)" :searchInput="search" />
    <v-flex pl-2 lg12 xl12 justify-center ma-auto>
      <v-layout wrap v-if="viewMode === 1">
        <v-flex lg4 xl3 class="course-item" v-if="this.user.userRole > 3">
          <HouseItem
            @onFinishCreateHouse="getHouses"
            :isEmpty="true" 
            transition="slide-x-transition"
          />
        </v-flex>
        <v-flex lg4 xl3 v-for="item in itemList" :key="item.id">
          <HouseItem :content="item" transition="slide-x-transition" />
        </v-flex>
      </v-layout>
      <v-layout wrap v-if="viewMode === 2">
        <HouseListItem
          :houses="itemList"
          @onFinishCreateHouse="getHouses"
          transition="slide-x-transition"
        />
      </v-layout>
    </v-flex>
    <v-flex pl-2 xl10 justify-center ma-auto>
      <Pagination
        :currentPage="currentPage"
        :pages="totalPages"
        :rowDataLength="itemList.length"
        @triggerpaging="handlePaging($event)"
      />
    </v-flex>
    <v-speed-dial
      v-model="fab"
      bottom
      right
      fixed
      direction="top"
      :transition="'slide-y-reverse-transition'"
    >
      <template v-slot:activator>
        <v-btn v-model="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab">mdi-close</v-icon>
          <v-icon v-else>mdi-settings</v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="indigo" @click="viewMode = 1">
        <v-icon>mdi-view-grid</v-icon>
      </v-btn>
      <v-btn fab dark small color="red" @click="viewMode = 2">
        <v-icon>mdi-view-list</v-icon>
      </v-btn>
    </v-speed-dial>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import PageTitle from "@/components/kit/PageTitle";
import Pagination from "@/components/kit/Pagination";
import HouseItem from "@/components/houses/HouseItem";
import HouseListItem from "@/components/houses/HouseListItem";
import { RepositoryFactory } from "@/repository/RepositoryFactory";
const houseRepository = RepositoryFactory.get("house");
export default {
  components: {
    PageTitle,
    HouseItem,
    HouseListItem,
    Pagination
  },
  data() {
    return {
      viewMode: 2,
      fab: false,
      search: "",
      page: 2,
      itemList: [],
      currentPage: 1,
      pageSize: 2,
      totalPages: 1,
      isLoading: false,
      searchItems: []
    };
  },
  computed: {
    ...mapState({ user: state => state.user }),
  },
  mounted() {
    this.$nextTick(function() {
      window.addEventListener("resize", this.getWindowWidth);
    });
    this.getHouses();
  },
  watch: {
    currentPage: function() {
      if (this.currentPage != 0) {
        this.getHouses();
      }
      deep: true;
    },
    viewMode: function() {
      this.getHouses()
    }
  },
  methods: {
    getWindowWidth(event) {
      let width = document.documentElement.clientWidth;
      if (width >= 1900) {
        this.pageSize = 7;
      } else {
        this.pageSize = 5;
      }
    },
    closeForm() {
      this.addHomeDialog = false;
    },
    async getHouses() {
      this.getWindowWidth();
      const { data } = await houseRepository.getHouses(
        this.currentPage,
        this.pageSize
      );
      this.itemList = this.formatListItem(data.result.data);
      this.totalPages = data.result.totalPages;
    },
    handlePaging(e) {
      this.currentPage = e;
    },
    handleSearchAutoComplete(data) {
      if (data.val !== null && data.val.length === 0) {
        this.getHouses()
        return
      }
      // if (data.items.length > 0) return
      this.isLoading = true
      fetch('http://spacenet.vn:1357/api/house', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(res => res.json())
      .then(res => {
        console.log(res)
        this.searchItems = res.result.data
      })
      .catch(err => {console.log(err)})
      .finally(() => (this.isLoading = false))
    },
    async searchHouseByName(name) {
      const {data} = await houseRepository.getHouseByName(name)
      console.log(data)
      this.itemList = data.result.data
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
  }
};
</script>

<style scoped>
/* .course-item.lg4 {
  flex-basis: 32.6666666%;
  -webkit-box-flex: 0;
  -ms-flex-positive: 0;
  flex-grow: 0;
}
.course-item.xl3 {
  flex-basis: 23%;
  -webkit-box-flex: 0;
  -ms-flex-positive: 0;
  flex-grow: 0;
} */
</style>
