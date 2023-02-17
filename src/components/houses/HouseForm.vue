<template>
  <div>
    <v-form ref="form" lazy-validation>
      <v-container class="pa-5" grid-list-xs>
        <v-layout wrap>
          <v-flex xs6 pr-3>
            <vue-upload-multiple-image
                @upload-success="uploadImageSuccess"
                @before-remove="beforeRemove"
                @edit-image="editImage"
                :dataImages="houseImages"
                @mark-is-primary="sortImages"
              ></vue-upload-multiple-image>
          </v-flex>
          <v-flex xs6>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  color="indigo"
                  v-model="name"
                  label="Tên"
                  :rules="nameRules"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-text-field
                  color="indigo"
                  v-model="normalPrice"
                  type="number"
                  label="Giá (ngày thường)"
                  :rules="priceRules"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  color="indigo"
                  v-model="priceNote"
                  label="Ghi chú"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  color="indigo"
                  v-model="size"
                  :rules="sizeRules"
                  label="Sức chứa"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  v-model="address"
                  label="Địa chỉ"
                  value
                  rows="3"
                  required
                  color="indigo"
                  :rules="addressRules"
                ></v-textarea>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-container>
    </v-form>
    <v-card-actions class="pa-5">
      <v-spacer></v-spacer>
      <v-btn depressed dark color="blue darken-1" @click="closeForm">Đóng</v-btn>
      <v-btn depressed dark color="indigo darken-1" @click="createHouse">Hoàn tất</v-btn>
    </v-card-actions>
    <v-snackbar v-model="snackbar" top :timeout="5000">
      {{snackbarMes}}
      <v-btn @click="snackbar = false" fab icon color="grey">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </div>
</template>
<script>
import { mapState } from "vuex"
import VueUploadMultipleImage from '@/components/plugins/vue-upload-multiple-image/VueUploadMultipleImage'
import {RepositoryFactory} from '@/repository/RepositoryFactory'
const houseRepository = RepositoryFactory.get('house')
export default {
  components: {
    VueUploadMultipleImage
  },
  props: {},
  watch: {},
  data() {
    return {
      image: [],
      valueName: "",
      loader: false,
      name: "",
      address: "",
      normalPrice: 0,
      priceNote: "",
      size: "",
      houseImages: [],
      houseImageFile: null,
      nameRules: [
        v => !!v || "Tên nhà không được để trống"
      ],
      addressRules: [
        v => !!v || "Địa chỉ nhà không được để trống"
      ],
      priceRules: [
        v => !!v || "Giá nhà không được để trống"
      ],
      sizeRules: [
        v => !!v || "Sức chứa nhà không được để trống"
      ],
      snackbar: false,
      snackbarMes: ""
    };
  },
  mounted() {},
  computed: {
      houseBackground() {
      return {
          backgroundImage: `url(${this.houseImage})`,
          backgroundBlendMode: 'multiply',
          backgroundPosition: `center center`,
          backgroundSize: `cover`,
          position: 'relative',
          overflow: 'hidden',
          houseImage: null,
          errorSnackbar: false,
          errorSnackbarContent: ''

      }
    },
    ...mapState({ user: state => state.user })
  },
  methods: {
    sortImages(data) {
      this.houseImages = data.images
    },
    closeForm() {
      this.$emit("onCloseHouseForm", true);
    },
    chooseUpload() {
      this.$refs.input.click()
    },
    fileSelected(e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length || files.length === 0) {
        return
      }
      if (files[0].type !== 'image/png' && files[0].type !== 'image/jpeg') {
        this.errorSnackbar = true
        this.errorSnackbarContent = 'Hình ảnh không đúng định dạng'
      } else {
        this.houseImageFile = files[0]
        this.houseImage = window.URL.createObjectURL(files[0])
      }
    },
    async createHouse() {
      if (this.houseImages.length === 0) {
        this.snackbar = true
        this.snackbarMes = "Căn hộ chưa có hình ảnh"
        return
      }
      if (this.$refs.form.validate()) {
        let houseSlug = this.name.toLowerCase().split(" ").join('-')
        let imageLinks = []
        for (let i = 0; i < this.houseImages.length; i++) {
          imageLinks.push(await this.uploadImageByDataURL(this.houseImages[i].path, `${houseSlug}${i}`, `houses/${this.user.userId}`))
        }
        const house = await {
          houseName: this.name,
          address: this.address,
          size: this.size,
          price: this.normalPrice,
          priceNote: this.priceNote,
          images: imageLinks
        }
        const data = await houseRepository.createHouse(house).then(res => {
          if (res.status === 200) {
            this.$emit("onCreateHome", true);
          }
        })
      }
    },
    uploadImageSuccess(formData, index, fileList) {
    this.houseImages = fileList
  },
  beforeRemove(index, done,fileList) {
    done()
    this.houseImages = fileList
  },
  editImage(formData, index, fileList){
    this.houseImages = fileList
  },
  },
};
</script>
<style scoped>
.house-image-container {
  width: 100%;
  height: 300px;
  border-radius: 4px;
  border: 2px dashed #ccc;
  position: relative;
  overflow: hidden;
}
.house-image-container .v-btn {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>