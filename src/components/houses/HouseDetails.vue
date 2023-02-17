<template>
  <v-container>
    <v-flex xs12 style="width:95%" class="black--text mb-5 pa-3">
      <v-layout wrap>
        <v-flex xs8>
          <v-col class="pa-0">
            <v-carousel v-model="slide" :height="carouselHeight" max="5" hide-delimiters>
              <v-carousel-item
                v-for="(item,index) in currentHouseImages"
                :key="index"
                :src="item.imgUrl"
              ></v-carousel-item>
            </v-carousel>
            <v-row class="mx-0 mt-2">
              <v-img
                style="cursor:pointer"
                v-for="(item, index) in currentHouseImages"
                :key="index"
                :src="item.imgUrl"
                :class="`grey lighten-2 ${item === currentHouseImages.length - 1 ? 'mr-0' : 'mr-1'}`"
                max-width="10%"
                max-height="150"
                :gradient="`${index === slide ? 'to top right, rgba(100,115,201,.33), rgba(25,32,72,.7)' : ''}`"
                @click="pickImage(index)"
              ></v-img>
            </v-row>
          </v-col>
        </v-flex>
        <v-flex xs4 pl-3>
          <h2 class="text-capitalize mb-3">{{currentHouse.houseName}}</h2>
          <v-chip
            dark
            small
            class="mr-2"
            :color="currentHouse.currentContract === undefined ? 'primary' : 'indigo darken-3'"
            label
          >{{currentHouse.currentContract === undefined ? 'Đang trống' : 'Đang cho thuê'}}</v-chip>
          <span class="red--text font-italic">{{!isRentingHouse ? '' : `${startDate} ~ ${endDate}`}}</span>
          <br />
          <div class="house-info mt-5">
            <span v-show="isRentingHouse" class="text-uppercase grey--text text--darken-1">Giờ Checkin</span>
            <br v-show="isRentingHouse" />
            <p v-show="isRentingHouse">{{formatStartTime}}</p>
            <span v-show="isRentingHouse" class="text-uppercase grey--text text--darken-1">Giờ Checkout</span>
            <br v-show="isRentingHouse" />
            <p v-show="isRentingHouse">{{formatEndTime}}</p>
            <span class="text-uppercase grey--text text--darken-1">Địa chỉ:</span>
            <br />
            <p>{{currentHouse.address}}</p>
            <span class="text-uppercase grey--text text--darken-1">Sức chứa:</span>
            <br />
            <p>{{currentHouse.size}}</p>
            <span v-if="user.userRole === 5" class="text-uppercase grey--text text--darken-1">Giá niêm yết / ngày:</span>
            <br v-if="user.userRole === 5" />
            <p v-if="user.userRole === 5">{{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(currentHouse.price)}}</p>
            <span class="text-uppercase grey--text text--darken-1">Ghi chú:</span>
            <br />
            <p>{{currentHouse.priceNote}}</p>
          </div>
        </v-flex>
        <v-flex xs12 mt-5>
          <v-tabs
          color="indigo accent-3"
            v-model="contractTab"
            class="elevation-0"
          >
      <v-tabs-slider></v-tabs-slider>
      <v-tab
        v-for="(item, index) in tabs"
        :key="item"
        :href="`#tab-${index}`"
      >
        {{ item }}
      </v-tab>
      </v-tabs>
      <v-tabs-items v-model="contractTab">
      <v-tab-item
        :value="'tab-0'"
      >
      <br/>
        <ContractDataTable :houseObj="currentHouse" @endContract="getHouse" @openContract="getHouse"/>
      </v-tab-item>
      <v-tab-item
        :value="'tab-1'"
      >
        <ContractCalendar :isChangeContracts="isChangeContracts" v-if="user.userRole === 5"/>
      </v-tab-item>
      </v-tabs-items>
    
        </v-flex>
      </v-layout>
    </v-flex>
    <v-dialog v-model="contractDialog" width="800" persistent>
      <v-card>
        <v-card-title>Thông tin hợp đồng</v-card-title>
        <v-container class="px-5">
          
        </v-container>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="indigo lighten-1" @click="contractDialog = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-if="customerInfo !== undefined" v-model="editCustomerDialog" width="600">
      <v-card>
        <v-card-title>Chỉnh sửa thông tin khách hàng</v-card-title>
        <v-container class="px-5 pt-0" grid-list-xs>
          <v-layout wrap>
            <v-flex xs12>
              <v-form ref="edtiCusform" lazy-validation>
                <v-layout wrap>
                  <v-flex xs7 pr-2>
                    <v-text-field
                      color="indigo"
                      v-model="customerInfo.cusName"
                      label="Tên khách hàng"
                      :rules="nameRules"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5>
                    <v-text-field
                      color="indigo"
                      v-model="customerInfo.phoneNums"
                      label="Số điện thoại"
                      :rules="phoneRules"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs7 pr-2>
                    <v-text-field
                      color="indigo"
                      v-model="customerInfo.email"
                      label="Email"
                      type="email"
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs5>
                    <v-text-field
                      color="indigo"
                      v-model="customerInfo.identifier"
                      label="Chứng minh thư (Passport)"
                      :rules="identifierRules"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-textarea
                      v-model="customerInfo.address"
                      label="Địa chỉ"
                      value
                      color="indigo"
                    ></v-textarea>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-flex>
          </v-layout>
          <v-card-actions class="px-0">
            <v-spacer></v-spacer>
            <v-btn depressed dark color="indigo lighten-1" @click="editCustomerDialog = false">Đóng</v-btn>
            <v-btn @click="updateCustomerInfo" depressed dark color="indigo darken-1">Hoàn tất</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editHouseDialog" width="600">
      <v-card>
        <v-card-title>Chỉnh sửa thông tin căn hộ</v-card-title>
        <v-container class="px-5 pt-0" grid-list-xs>
          <v-layout wrap>
            <v-flex xs12>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field
                    color="indigo"
                    v-model="editingHouse.houseName"
                    label="Tên"
                    :rules="nameRules"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs4>
                  <v-text-field
                    color="indigo"
                    v-model="editingHouse.price"
                    type="number"
                    label="Giá niêm yết / ngày"
                    :rules="priceRules"
                    required
                  ></v-text-field>
                </v-flex>
                <v-flex xs8>
                  <v-text-field
                    color="indigo"
                    v-model="editingHouse.priceNote"
                    label="Ghi chú"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    color="indigo"
                    v-model="editingHouse.size"
                    :rules="sizeRules"
                    label="Sức chứa"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    v-model="editingHouse.address"
                    label="Địa chỉ"
                    value
                    required
                    color="indigo"
                    :rules="addressRules"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
          <v-card-actions class="px-0">
            <v-spacer></v-spacer>
            <v-btn depressed dark color="indigo lighten-1" @click="editHouseDialog = false">Đóng</v-btn>
            <v-btn @click="updateHouse" depressed dark color="indigo darken-1">Hoàn tất</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editImageDialog" width="600">
      <v-card>
        <v-card-title>Chỉnh sửa hình ảnh căn hộ</v-card-title>
        <v-container class="px-5 pt-0" grid-list-xs>
          <v-layout wrap>
            <v-flex xs12>
              <vue-upload-multiple-image
                @upload-success="uploadImageSuccess"
                @before-remove="beforeRemove"
                @edit-image="editImage"
                :dataImages="houseImages"
                @mark-is-primary="sortImages"
              ></vue-upload-multiple-image>
            </v-flex>
          </v-layout>
          <v-card-actions class="px-0">
            <v-spacer></v-spacer>
            <v-btn depressed dark color="indigo" @click="closeEditImageDialog">Đóng</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmRemoveDialog" width="400">
      <v-card>
        <v-card-title class="headline">Xác nhận</v-card-title>
        <v-card-text>
          Bạn có chắc chắn muốn xóa căn hộ
          <b>{{currentHouse.houseName}}</b>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="blue darken-1" @click="confirmRemoveDialog = false">Hủy bỏ</v-btn>
          <v-btn depressed dark color="indigo darken-1" @click="removeHouse">Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="closeContractDialog" width="400">
      <v-card>
        <v-card-title class="headline">Xác nhận</v-card-title>
        <v-card-text>
          Bạn có chắc chắn kết thúc hợp đồng?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="blue darken-1" @click="closeContractDialog = false">Hủy bỏ</v-btn>
          <v-btn depressed dark color="indigo darken-1" @click="closeContract">Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-speed-dial
      v-model="houseDetailsSetting"
      bottom
      right
      fixed
      direction="top"
      :transition="'slide-y-reverse-transition'"
      v-if="user.userRole === 5"
    >
      <template v-slot:activator>
        <v-btn v-model="houseDetailsSetting" color="blue darken-2" dark fab>
          <v-icon v-if="houseDetailsSetting">mdi-close</v-icon>
          <v-icon v-else>mdi-settings</v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="primary darken-3" @click="confirmRemoveDialog = true" v-if="!isRentingHouse">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
      <v-btn fab dark small color="indigo" @click="editImageDialog = true">
        <v-icon>mdi-image-multiple</v-icon>
      </v-btn>
      <v-btn fab dark small color="red" @click="openEditHouseForm">
        <v-icon>mdi-home</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-snackbar v-model="snackbar" top :timeout="5000">
      {{snackbarMes}}
      <v-btn @click="snackbar = false" fab icon color="grey">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import Loader from "@/components/Loader";
import { RepositoryFactory } from "@/repository/RepositoryFactory";
import VueUploadMultipleImage from "@/components/plugins/vue-upload-multiple-image/VueUploadMultipleImage";
import ContractDataTable from '@/components/contracts/ContractDataTable'
import ContractCalendar from '@/components/contracts/ContractCalendar'
const houseRepository = RepositoryFactory.get("house");
const contractRepository = RepositoryFactory.get("contract");
const imageRepository = RepositoryFactory.get("image");
const customerRepository = RepositoryFactory.get("customer");
export default {
  props: {
    content: Object
  },
  components: {
    Loader,
    VueUploadMultipleImage,
    ContractDataTable,
    ContractCalendar
  },
  data() {
    return {
      snackbar: false,
      snackbarMes: "",
      slide: 0,
      houseId: "",
      currentHouseImages: [],
      houseImages: [],
      currentHouse: {
        images: []
      },
      dates: ["2019-10-15", "2019-10-15"],
      contractDialog: false,
      customerInfo: {},
      nameRules: [v => !!v || "Tên khách hàng không được để trống"],
      phoneRules: [v => !!v || "Số điện thoại không được để trống"],
      emailRules: [v => !!v || "Email không được để trống"],
      identifierRules: [v => !!v || "Chứng minh thư không được để trống"],
      addressRules: [v => !!v || "Địa chỉ nhà không được để trống"],
      carouselHeight: 500,
      houseDetailsSetting: false,
      editHouseDialog: false,
      editingHouse: {},
      nameRules: [v => !!v || "Tên nhà không được để trống"],
      addressRules: [v => !!v || "Địa chỉ nhà không được để trống"],
      priceRules: [v => !!v || "Giá nhà không được để trống"],
      timeRules: [v => !!v || "Thời gian không được để trống"],
      sizeRules: [v => !!v || "Sức chứa không được để trống"],
      confirmRemoveDialog: false,
      isRentingHouse: false,
      editImageDialog: false,
      startTime: "12:00",
      endTime: "12:00",
      rentalFee: 0,
      deposit: 0,
      editCustomerDialog: false,
      closeContractDialog: false,
      contractTab: null,
      tabs: ['Danh sách hợp đồng', 'Lịch thuê nhà'],
      isChangeContracts: false
    };
  },
  computed: {
    ...mapState({ user: state => state.user }),
    startDate() {
      return new Date(this.dates[0]) < new Date(this.dates[1])
        ? this.convertDate(this.dates[0])
        : this.convertDate(this.dates[1]);
    },
    endDate() {
      return new Date(this.dates[0]) > new Date(this.dates[1])
        ? this.convertDate(this.dates[0])
        : this.convertDate(this.dates[1]);
    },
    formatStartTime() {
      const timeArr = this.startTime.split(':')
      return `${timeArr[0] > 12 ? timeArr[0] % 12 : timeArr[0]}:${timeArr[1]} ${timeArr[0] >= 12 ? 'PM' : 'AM'}`
    },
    formatEndTime() {
      const timeArr = this.endTime.split(':')
      return `${timeArr[0] > 12 ? timeArr[0] % 12 : timeArr[0]}:${timeArr[1]} ${timeArr[0] >= 12 ? 'PM' : 'AM'}`
    },
    formatDate() {
      const startDate = new Date(this.dates[0]);
      const endDate = new Date(this.dates[1]);
      console.log(endDate);
      return this.convertDate(startDate) + " ~ " + this.convertDate(endDate);
    },
    today() {
      console.log(this.convertDateForPicker(new Date()));
      return this.convertDateForPicker(new Date());
    }
  },
  mounted() {
    this.houseId = this.$route.params.id;
    this.getCurrentHouse();
    this.$nextTick(function() {
      window.addEventListener("resize", this.getWindowWidth);
      this.getWindowWidth();
    });
    this.tabs = this.user.userRole === 5 ? ['Danh sách hợp đồng', 'Lịch thuê nhà'] : ['Danh sách hợp đồng']
  },
  created() {},
  methods: {
    getWindowWidth(event) {
      let width = document.documentElement.clientWidth;
      if (width >= 1900) {
        this.carouselHeight = 650;
      }
    },
    async getCurrentHouse() {
      const { data } = await houseRepository.getCurrentHouse(this.houseId);
      this.currentHouse = data.result.data.house[0];
      this.currentHouseImages = this.currentHouse.images.map(image => {
        return { id: image.id, imgUrl: image.imgUrl };
      });
      this.rentalFee = this.currentHouse.price;
      this.customerInfo = data.result.data.customer;
      this.isRentingHouse = typeof (data.result.data.house[0].currentContract) === "object" ? true : false
      if (this.isRentingHouse) {
        const startDate = this.currentHouse.currentContract.startDate;
        const endDate = this.currentHouse.currentContract.endDate;
        this.startTime = this.convertTime(startDate);
        this.endTime = this.convertTime(endDate);
        this.dates = [startDate, endDate];
      } else {
        this.dates = [this.today, this.today];
      }
      this.houseImages = this.currentHouseImages.map(image => {
        return { id: image.id, path: image.imgUrl };
      });
    },
    addMoreCusInfo() {
      this.customerInfo.push({});
    },
    closeContract() {
      const data = contractRepository.closeContract(this.currentHouse.currentContract.id).then(res => {
        console.log(res)
        if (res.status === 200) {
          this.currentHouse = res.data.result.data.house[0]
          this.customerInfo = {
          cusName: "",
          phoneNums: "",
          identifier: "",
          address: "",
          email: ""
        };
        this.dates = [this.today, this.today];
        this.closeContractDialog = false
        this.isRentingHouse = false
        this.snackbarMes = "Kết thúc hợp đồng thành công. Có thể kí hợp đồng mới."
        this.snackbar = true
        }
      })
    },
    async updateContract() {
      const startDateTime = new Date(`${this.dates[0]}T${this.startTime}`);
      const endDateTime = new Date(`${this.dates[1]}T${this.endTime}`);
      console.log(this.startTime)
      const contract = {
        startDate: startDateTime,
        endDate: endDateTime,
        rentalFee: this.rentalFee,
        deposit: this.deposit
      };
      const data = await contractRepository
        .updateContract(contract, this.currentHouse.currentContract.id)
        .then(res => {
          if (res.status === 200) {
            this.currentHouse.currentContract = res.data.result.data[0];
            this.rentalFee = res.data.result.data[0].rentalFee;
            this.deposit = res.data.result.data[0].deposit;
            const startDate = res.data.result.data[0].startDate;
            const endDate = res.data.result.data[0].endDate;
            this.dates = [startDate, endDate];
            this.contractDialog = false;
          }
        });
    },
    pickImage(index) {
      this.slide = index;
    },
    openEditHouseForm() {
      this.editingHouse = Object.assign(this.currentHouse, {});
      console.log(this.editingHouse);
      this.editHouseDialog = true;
    },
    async updateHouse() {
      const updatedHouse = {
        houseName: this.editingHouse.houseName,
        price: this.editingHouse.price,
        address: this.editingHouse.address,
        size: this.editingHouse.size,
        priceNote: this.editingHouse.priceNote
      };
      const data = houseRepository
        .editHouse(this.editingHouse.id, updatedHouse)
        .then(res => {
          if (res.status === 200) {
            this.snackbar = true;
            this.snackbarMes = "Thay đổi thông tin căn hộ thành công";
            this.editHouseDialog = false;
          }
        });
    },
    async removeHouse() {
      const data  = houseRepository
        .removeHouse(this.currentHouse.id)
        .then(res => {
          if (res.status === 200) {
            this.$router.push("/dashboard/houses");
          }
        });
    },
    async uploadImageSuccess(formData, index, fileList) {
      this.houseImages = fileList;
      let houseSlug = this.currentHouse.houseName
        .toLowerCase()
        .split(" ")
        .join("-");
      const imageLink = await this.uploadImageByDataURL(
        this.houseImages[index].path,
        `${houseSlug}${index}`,
        `houses/${this.user.userId}`
      );
      const data = await imageRepository
        .createAnImage(this.currentHouse.id, { imgUrl: imageLink })
        .then(res => {
          if (res.status === 200) {
            this.snackbarMes = "Thêm hình ảnh thành công";
            this.snackbar = true;
            this.getCurrentHouse()
            console.log(this.houseImages)
          }
        });
    },
    async beforeRemove(index, done, fileList) {
      done();
      console.log(this.houseImages[index]);
      const data = await imageRepository
        .removeImage(this.houseImages[index].id)
        .then(res => {
          if (res.status === 200) {
            this.snackbarMes = "Xóa hình ảnh thành công";
            this.snackbar = true;
            this.getCurrentHouse();
          }
        });
    },
    async editImage(formData, index, fileList) {
      // this.houseImages = this.houseImages.splice(index, 1)
      this.houseImages = await fileList;
      let houseSlug = this.currentHouse.houseName
        .toLowerCase()
        .split(" ")
        .join("-");
      const newImage = this.houseImages[index];
      const imageLink = await this.uploadImageByDataURL(
        newImage.path,
        `${houseSlug}${index}${newImage.name}`,
        `houses/${this.user.userId}`
      );
      const data = await imageRepository
        .updateImage(this.houseImages[index].id, { imgUrl: imageLink })
        .then(res => {
          if (res.status === 200) {
            this.snackbarMes = "Thay đổi hình ảnh thành công";
            this.snackbar = true;
          }
        });
    },
    updateCustomerInfo() {
      if (this.$refs.edtiCusform.validate()) {
        const data = customerRepository
          .editInfo(this.customerInfo, this.currentHouse.currentContract.id)
          .then(res => {
            if (res.status = 200) {
              this.customerInfo = res.data.result.data[0]
              this.editCustomerDialog = false;
            }
          });
      }
    },
    sortImages(data) {
      this.houseImages = data.images;
    },
    closeEditImageDialog() {
      this.editImageDialog = false;
      this.getCurrentHouse()
    },
    getHouse(data) {
      if (data) {
        this.getCurrentHouse()
      }
    }
  },
  watch: {
    contractTab: function() {
      if (this.contractTab === 'tab-0') {
        this.isChangeContracts = false
      } else {
        this.isChangeContracts = true
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getWindowWidth);
  }
};
</script>

<style scoped>
.cus-infor {
  overflow: hidden;
}
.cus-infor::after {
  content: "";
  border: 2px solid #0d47a1;
  display: block;
  transform: translateX(-35%);
}
</style>
