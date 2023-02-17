<template>
  <v-layout column>
    <v-card-title>
      <h3 class="headline">Thông tin</h3>
      <v-btn class="ml-2" color="grey lighten-4" depressed fab small @click="activeForm">
          <v-icon v-if="isEditing">mdi-close</v-icon>
          <v-icon v-else>mdi-pencil</v-icon>
        </v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="changePasswordDialog = true" class="ma-2" tile depressed color="primary">
      Đổi mật khẩu
    </v-btn>
    </v-card-title>
    <v-form>
      <v-container pa-5 grid-list-xl>
        <v-form ref="form"
          v-model="profileForm"
          lazy-validation>
        <v-layout wrap>
          <v-flex xs4 pa-1>
            <v-text-field :value="user.username" label="Tên đăng nhập" disabled></v-text-field>
          </v-flex>
          <v-flex xs4 pa-1>
            <v-text-field :value="user.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'" label="Trạng thái" disabled></v-text-field>
          </v-flex>
          <v-flex xs4 pa-1>
            <v-text-field color="primary darken-1" v-model="user.identifier" :rules="rules.identifierRules" label="Chứng minh thư (Passport)" :disabled="!isEditing"></v-text-field>
          </v-flex>
          <v-flex xs8 pa-1>
            <v-text-field color="primary darken-1" v-model="user.name" :rules="rules.nameRules" label="Họ và tên" :disabled="!isEditing"></v-text-field>
          </v-flex>
          <v-flex xs4 pa-1>
            <v-text-field color="primary darken-1" v-model="user.phoneNums" :rules="rules.phoneNumsRules" label="Số điện thoại" :disabled="!isEditing"></v-text-field>
          </v-flex>
          <v-flex xs12 pa-1>
            <v-text-field color="primary darken-1" v-model="user.address" label="Địa chỉ" :rules="rules.addressRules" :disabled="!isEditing"></v-text-field>
          </v-flex>
          <v-slide-y-transition>
          <v-flex xs12 v-show="isEditing" pa-1>
            <v-text-field type="password" color="primary darken-1" v-model="user.password" label="Mật khẩu" :rules="rules.passwordRules"></v-text-field>
          </v-flex>
      </v-slide-y-transition>
        </v-layout>
        </v-form>
      </v-container>
    </v-form>
    <!-- <v-divider class="my-2" v-if="isUpdate"></v-divider>
    <v-card-actions class="px-5">
      <v-btn :disabled="!isEditing" v-if="isUpdate" color="success" @click="save">Lưu</v-btn>
    </v-card-actions> -->
    <v-dialog width="600" persistent v-model="changePasswordDialog">
      <v-card>
        <v-card-title class="headline pb-0 mb-0">Thay đổi mật khẩu</v-card-title>
        <v-form ref="passwordForm" v-model="passwordForm" lazy-validation>
          <v-container class="px-6 pb-3 pt-0" grid-list-xs>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  color="indigo"
                  type="password"
                  v-model="password.password"
                  label="Mật khẩu cũ"
                  :rules="passwordRules.old"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  color="indigo"
                  type="password"
                  v-model="password.newPassword"
                  :rules="passwordRules.new"
                  label="Mật khẩu mới"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  color="indigo"
                  type="password"
                  v-model="password.confirmPassword"
                  :rules="[comparePassword]"
                  label="Xác nhận lại"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-card-actions class="px-6 pb-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn depressed dark color="blue darken-1" @click="closeChangePasswordDialog">Đóng</v-btn>
          <v-btn depressed dark color="indigo darken-1" @click="changePassword()">Hoàn tất</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" top :timeout="5000">
      {{snackbarMes}}
      <v-btn @click="snackbar = false" fab icon color="grey">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-layout>
</template>

<script>
import {RepositoryFactory} from '@/repository/RepositoryFactory'
const userRepository = RepositoryFactory.get('user')
export default {
  props: {
    isInstructor: {
      type: Boolean,
      default: false
    },
    userInput:{
      required:false,
      type:Object,
      default:null
    },
    isUpdate:{
      required:false,
      type:Boolean,
      default:true
    }
  },
  components: {
  },
  data() {
    return {
      snackbar: false,
      changePasswordDialog: false,
      isEditing: null,
      certificates:[],
      listUpload: [],
      profileForm: false,
      passwordForm: false,
      password: {
        password: '', newPassword: '', confirmPassword: ''
      },
      passwordRules: {
        old: [
          v => !!v || 'Mật khẩu cũ không được để trống'
        ],
        new: [
          v => !!v || 'Mật khẩu mới không được để trống'
        ],
        confirm: [
          v => !!v || 'Mật khẩu xác nhận không được để trống'
        ]
      },
      user: {
          name: '',
          username: '',
          status: '',
          address: '',
          phoneNums: '',
          identifier: '',
          password: ''
      },
      rules: {
        nameRules: [
          v => !!v || 'Tên người dùng không được để trống'
        ],
        passwordRules: [
          v => !!v || 'Mật khẩu không được để trống'
        ]
      },
      snackbarMes: ''
    }
  },
  computed: {
    comparePassword() {
      return () => (this.password.newPassword === this.password.confirmPassword || 'Mật khẩu xác nhận không đúng')
    }
  },
  mounted() {
      this.getProfile()
      this.$refs.form.reset()
      this.resetForm()
  },
  methods: {
    async getProfile() {
      const {data} = await userRepository.getProfile()
      this.user = data.result.data
    },
    resetForm() {
      this.$refs.form.resetValidation()
    },
    closeChangePasswordDialog() {
      this.$refs.passwordForm.reset()
      this.$refs.passwordForm.resetValidation()
      this.changePasswordDialog = false
    },
    changePassword() {
      if (this.$refs.passwordForm.validate()) {
          const {data} = userRepository.changePassword(this.password).then(res => {
          console.log(res)
          if (res.status === 200) {
            this.changePasswordDialog = false
            this.snackbar = true
            this.snackbarMes = 'Thay đổi mật khẩu thành công'
          }
        }) 
      }
    },
    editProfile() {
      if (this.$refs.form.validate()) {
        const {data} = userRepository.editProfile(this.user).then(res => {
          if (res.status === 200) {
            this.user = res.data.result.data
            this.user['password'] = ''
            this.snackbar = true
            this.snackbarMes = 'Thay đổi thông tin thành công'
          }
        })
      }
    },
    activeForm() {
      if (!this.isEditing) {
        this.resetForm()
        this.isEditing = true
      } else {
        if (!this.$refs.form.validate()) {
          this.isEditing = true
        } else {
          this.isEditing = false
        }
      }
    }
  },
  watch: {
    isEditing: function() {
      if (!this.isEditing) {
        this.resetForm()
        this.editProfile()
      }
    }
  }
}
</script>

<style scoped>
</style>
