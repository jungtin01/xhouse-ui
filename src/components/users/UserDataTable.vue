<template>
  <v-flex>
    <v-data-table
      :headers="headers"
      :items="listUsers"
      :search="search"
      :items-per-page="10"
      :loading="loader"
      hide-default-footer
      loading-text="Đang tải"
    >
      <template v-slot:top>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="addUserDialog = true; isEditing = false"
            depressed
            dark
            class="mb-2"
          >Thêm người dùng</v-btn>
        </v-card-actions>
      </template>
      <template v-slot:item.status="{item}">
        <v-chip
          class="ma-2"
          label
          dark
          small
          :color="getColor(item.status)"
        >{{item.status === 'active' ? 'Đang hoạt động' : 'Đã khóa'}}</v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="mr-2" @click="confirmChangeStatus(item)">mdi-lock</v-icon>
        <v-icon small @click="confirmRemoveItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    <Pagination
      :currentPage="currentPage"
      :pages="totalPages"
      :rowDataLength="listUsers.length"
      @triggerpaging="handlePaging($event)"
    />
    <v-dialog width="600" persistent v-model="addUserDialog">
      <v-card>
        <v-card-title class="headline pb-0 mb-0">Thông tin người dùng</v-card-title>
        <v-form ref="form" lazy-validation>
          <v-container class="px-6 pb-3 pt-0" grid-list-xs>
            <v-layout wrap>
              <v-flex xs6>
                <v-text-field
                  color="indigo"
                  v-model="username"
                  label="Tên đăng nhập"
                  :rules="usernameRules"
                  required
                  v-if="!isEditing"
                ></v-text-field>
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  type="password"
                  color="indigo"
                  v-model="password"
                  label="Mật khẩu"
                  :rules="passwordRules"
                  required
                  v-if="!isEditing"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  color="indigo"
                  v-model="fullName"
                  label="Tên người dùng"
                  :rules="fullNameRules"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-select
                  :disabled="isEditing"
                  v-model="selectedRole"
                  :items="this.user.userRole === 5 ? roleItems.role5 : roleItems.role10"
                  item-text="text"
                  item-value="value"
                  label="Vai trò"
                ></v-select>
              </v-flex>
              <v-flex xs12>
                <v-checkbox
                  v-if="!isEditing"
                  v-model="isActive"
                  color="indigo"
                  class="mx-2"
                  label="Kích hoạt tài khoản sau khi khởi tạo"
                ></v-checkbox>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
        <v-card-actions class="px-6 pb-6 pt-0">
          <v-spacer></v-spacer>
          <v-btn depressed dark color="blue darken-1" @click="resetForm">Đóng</v-btn>
          <v-btn
            depressed
            dark
            color="indigo darken-1"
            @click="isEditing ? editUser() : createUser()"
          >Hoàn tất</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmChangeStatusDialog" width="400">
      <v-card>
        <v-card-title class="headline">Xác nhận</v-card-title>
        <v-card-text>
          Bạn có chắc chắn muốn
          <b>{{editedUser.status === 'active' ? 'vô hiệu hóa' : 'kích hoạt'}}</b>
          tài khoản
          <b>{{editedUser.username}}</b>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            dark
            color="blue darken-1"
            @click="confirmChangeStatusDialog = false"
          >Hủy bỏ</v-btn>
          <v-btn depressed dark color="indigo darken-1" @click="changeStatus()">Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmRemoveDialog" width="400">
      <v-card>
        <v-card-title class="headline">Xác nhận</v-card-title>
        <v-card-text>
          Bạn có chắc chắn muốn xóa tài khoản
          <b>{{editedUser.username}}</b>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="blue darken-1" @click="confirmRemoveDialog = false">Hủy bỏ</v-btn>
          <v-btn
            depressed
            dark
            color="indigo darken-1"
            @click="removeUser(), confirmRemoveDialog = false"
          >Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-flex>
</template>

<script>
import { mapState } from "vuex";
import { RepositoryFactory } from "@/repository/RepositoryFactory";
import Pagination from "@/components/kit/Pagination";
const userRepository = RepositoryFactory.get("user");

export default {
  components: {
    Pagination
  },
  props: {
    search: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapState({ user: state => state.user })
  },
  data() {
    return {
      dialog: false,
      editedUser: {},
      isEditing: false,
      loader: false,
      headers: [
        { text: "Tên đăng nhập", value: "username", align: "left" },
        { text: "Tên người dùng", value: "name", align: "left" },
        { text: "Vai trò", value: "roleName", align: "center" },
        { text: "Trạng thái", value: "status", align: "center" },
        { text: "Chỉnh sửa", value: "action", sortable: false }
      ],
      listUsers: [],
      addUserDialog: false,
      selectedRole: 1,
      roleItems: {
        role10: [
          { text: "Người dùng", value: 1 },
          { text: "Đại lý", value: 3 },
          { text: "Chủ nhà", value: 5 },
          { text: "Quản trị viên", value: 10 }
        ],
        role5: [{ text: "Đại lý", value: 3 }]
      },
      username: "",
      password: "",
      fullName: "",
      usernameRules: [v => !!v || "Tên đăng nhập không được để trống"],
      passwordRules: [v => !!v || "Mật khẩu không được để trống"],
      fullNameRules: [v => !!v || "Tên người dùng không được để trống"],
      isActive: true,
      confirmRemoveDialog: false,
      confirmChangeStatusDialog: false,
      currentPage: 1,
      pageSize: 10,
      totalPages: 1
    };
  },
  mounted() {
    this.getUsersPagination();
    this.selectedRole = this.user.userRole === 5 ? 3 : 0;
  },
  methods: {
    resetForm() {
      this.addUserDialog = false;
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
    formatRoleName(role) {
      console.log("format");
      return this.getRoleName(role);
    },
    async getUsersPagination() {
      if (this.user.userRole === 5) {
        const data = await userRepository
          .getShopUsers(this.currentPage, this.pageSize)
          .then(res => {
            if (res.status === 200) {
              this.listUsers = this.formatListUser(res.data.result.data.subUsers);
              this.totalPages = res.data.result.totalPages;
            }
          });
      } else {
        const data = await userRepository
          .getUsers(this.currentPage, this.pageSize)
          .then(res => {
            if (res.status === 200) {
              this.listUsers = this.formatListUser(res.data.result.data);
              this.totalPages = res.data.result.totalPages;
            }
          });
      }
    },
    getColor(status) {
      return status === "active" ? "green" : "red";
    },
    async createUser() {
      if (this.$refs.form.validate()) {
        const newUser = {
          username: this.username,
          password: this.password,
          name: this.fullName,
          status: this.isActive ? "active" : "inactive",
          role: this.selectedRole
        };
        const data = await userRepository.createUser(newUser).then(res => {
          if (res.status === 200) {
            this.addUserDialog = false;
            this.getUsersPagination();
            this.$refs.form.reset();
            this.$refs.form.resetValidation();
          }
        });
      }
    },
    confirmRemoveItem(item) {
      this.editedUser = Object.assign({}, item);
      this.confirmRemoveDialog = true;
    },
    async removeUser() {
      const data = await userRepository
        .removeUser(this.editedUser.id)
        .then(res => {
          if (res.status === 200) {
            this.getUsersPagination();
            this.isEditing = false;
          }
        });
    },
    async editUser() {
      const user = {
        name: this.fullName,
        status: this.editedUser.status
      };
      const data = await userRepository
        .editUser(this.editedUser.id, user)
        .then(res => {
          if (res.status === 200) {
            this.getUsersPagination();
            this.isEditing = false;
            this.addUserDialog = false;
          }
        });
    },
    confirmChangeStatus(item) {
      this.editedUser = Object.assign({}, item);
      this.confirmChangeStatusDialog = true;
    },
    async changeStatus() {
      const user = {
        name: this.fullName,
        status: this.editedUser.status === "active" ? "inactive" : "active"
      };
      const data = await userRepository
        .editUser(this.editedUser.id, user)
        .then(res => {
          if (res.status === 200) {
            this.getUsersPagination();
            this.isEditing = false;
            this.confirmChangeStatusDialog = false;
          }
        });
    },
    handlePaging(e) {
      this.currentPage = e;
    }
  },
  watch: {
    search: {
      handler: function() {
        this.getUsersPagination();
      }
    },
    loader: {
      handler: function() {
        if (this.loader) {
          this.$store.commit("incrementLoader", 1);
        } else {
          this.$store.commit("incrementLoader", -1);
        }
      }
    },
    currentPage: function() {
      if (this.currentPage != 0) {
        this.getUsersPagination();
      }
      deep: true;
    },
    addUserDialog: function() {
      if (this.addUserDialog && this.user.userRole === 5) {
        this.isActive = true;
        this.selectedRole = 1;
      }
    }
  }
};
</script>
<style scoped>
.btn-active-deactive {
  width: 35px !important;
  height: 35px !important;
}
.btn-active-deactive i {
  font-size: 17px !important;
}
</style>