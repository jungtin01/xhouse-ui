<template>
  <v-flex>
    <v-card-actions class="px-5 py-2">
      <v-spacer></v-spacer>
      <v-btn
            v-if="user.userRole === 5"
            color="indigo darken-3"
            depressed
            @click="openCreateContractDialog(null)"
            dark
          >Thêm hợp đồng</v-btn>
          <v-flex xs3>
            <v-select
          class="ml-3"
          v-model="statusFilter"
          :items="contractStatus"
          :item-text="contractStatus.text"
          :item-value="contractStatus.value"
          label="Trạng thái"
        ></v-select>
          </v-flex>
    </v-card-actions>
    <v-data-table
      :headers="headers"
      :items="listContracts"
      :search="search"
      :items-per-page="10"
      :loading="loader"
      hide-default-footer
      loading-text="Đang tải"
    >
    <template v-slot:item.startDate="{item}">
        <span :class="`${item.status === 'inprogress' ? 'red--text' : ''}`">{{convertDateTime(item.startDate)}}</span>
      </template>
      <template v-slot:item.endDate="{item}">
        <span :class="`${item.status === 'inprogress' ? 'red--text' : ''}`">{{convertDateTime(item.endDate)}}</span>
      </template>
      <template v-slot:item.statusName="{item}">
        <v-chip
          class="ma-2"
          label
          dark
          small
          :color="item.color"
        >{{item.statusName}}</v-chip>
      </template>
      <template v-slot:item.rentalFee="{item}">
        {{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(item.rentalFee)}}
      </template>
      <template v-slot:item.deposit="{item}">
        {{new Intl.NumberFormat('vi-VN', {style: 'currency', currency: 'VND'}).format(item.deposit)}}
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon class="mr-1" small @click="openContract(item)">mdi-file-document-box</v-icon>
        <v-icon class="mr-1" v-if="item.status !== 'closed' && user.userRole === 5" small @click="openEditedContractDialog(item)">mdi-file-document-edit</v-icon>
        <v-icon class="mr-1" v-if="item.status !== 'closed' && user.userRole === 5" small @click="openEditCustomerDialog(item)">mdi-account-edit</v-icon>
        <v-icon class="mr-1" v-if="item.status === 'inprogress' && user.userRole === 5" small @click="confirmChangeContractStatus(item)">mdi-lock</v-icon>
        <v-icon class="mr-1" v-if="item.status === 'incomming' && user.userRole === 5 && houseObj.currentContract === undefined && item === nextContract" small @click="confirmChangeContractStatus(item)">mdi-lock-open</v-icon>
        <v-icon v-if="user.userRole === 5" small @click="confirmRemoveItem(item)">mdi-delete</v-icon>
      </template>
    </v-data-table>
    <Pagination
      :currentPage="currentPage"
      :pages="totalPages"
      :rowDataLength="listContracts.length"
      @triggerpaging="handlePaging($event)"
    />
    <v-dialog width="800" persistent v-model="editedContractDialog">
      <v-card>
        <v-card-title class="headline pt-1">{{editedContract ? 'Chỉnh sửa thông tin hợp đồng' : 'Thêm hợp đồng'}}</v-card-title>
        <ContractForm v-if="editedContractDialog" :houseOwner="houseObj" @editContract="createContract" @createContract="createContract" @closeContractForm="closeContractForm" :editedContract="editedContract"/>
      </v-card>
    </v-dialog>
    <v-dialog width="800" persistent v-model="editedCustomerDialog">
      <v-card>
        <v-card-title class="headline pb-0">Chỉnh sửa thông tin khách hàng</v-card-title>
        <CustomerForm @closeCustomerForm="closeCustomerForm" @editCustomerInfo="editCustomerInfo" v-if="editedCustomerDialog" :contractObj="editedContract"/>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmChangeStatusDialog" width="400">
      <v-card>
        <v-card-title class="headline">Xác nhận</v-card-title>
        <v-card-text v-if="editedContract !== null">
          Bạn có chắc chắn muốn <b>{{editedContract.status === 'inprogress' ? 'kết thúc' : 'mở'}}</b> hợp đồng <b>{{editedContract.id}}</b>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            depressed
            dark
            color="blue darken-1"
            @click="confirmChangeStatusDialog = false"
          >Hủy bỏ</v-btn>
          <v-btn v-if="editedContract !== null" depressed dark color="indigo darken-1" @click="editedContract.status === 'inprogress' ? endContract() : startContract()">Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmRemoveDialog" width="400">
      <v-card>
        <v-card-title class="headline">Xác nhận</v-card-title>
        <v-card-text v-if="editedContract !== null">
          Bạn có chắc chắn muốn <b>xóa</b> hợp đồng <b>{{editedContract.id}}</b>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn depressed dark color="blue darken-1" @click="confirmRemoveDialog = false">Hủy bỏ</v-btn>
          <v-btn
            depressed
            dark
            color="indigo darken-1"
            @click="removeContract(), confirmRemoveDialog = false"
          >Đồng ý</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="contractDialog" width="700">
      <v-card>
        <v-card-title class="headline">Thông tin hợp đồng</v-card-title>
        <v-flex pa-5 v-if="editedContract !== null">
          <ContractItem :contract="editedContract"/>
        </v-flex>
        <v-card-actions class="pa-3">
          <v-spacer></v-spacer>
          <v-btn depressed dark color="blue darken-1" @click="contractDialog = false">Đóng</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> 
    <v-snackbar v-model="snackbar" top :timeout="5000">
      {{snackbarMes}}
      <v-btn @click="snackbar = false" fab icon color="grey">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-flex>
</template>

<script>
import { mapState } from "vuex";
import { RepositoryFactory } from "@/repository/RepositoryFactory";
import Pagination from "@/components/kit/Pagination";
import ContractItem from "@/components/contracts/ContractItem"
import ContractForm from '@/components/contracts/ContractForm'
import CustomerForm from '@/components/customers/CustomerForm'
const contractRepository = RepositoryFactory.get("contract");

export default {
  components: {
    Pagination,
    ContractItem,
    ContractForm,
    CustomerForm
  },
  props: {
    search: {
      type: String,
      default: ""
    },
    houseObj: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapState({ user: state => state.user }),
  },
  data() {
    return {
      dialog: false,
      editedContract: {},
      isEditing: false,
      loader: false,
      headers: [
        { text: "Người thuê", value: "customer.cusName", align: "left" },
        { text: "Ngày bắt đầu (Giờ bắt đầu)", value: "startDate", align: "center" },
        { text: "Ngày kết thúc (Giờ kết thúc)", value: "endDate", align: "center" },
        { text: "Giá thuê", value: "rentalFee", align: "center" },
        { text: "Đặt cọc", value: "deposit", sortable: false, align: "center" },
        { text: "Trạng thái", value: "statusName", sortable: false, align: "center" },
        { text: "Chi tiết", value: "action", sortable: false, align: "center" }
      ],
      listContracts: [],
      addUserDialog: false,
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
      totalPages: 1,
      houseId: '',
      contractDialog: false,
      currentContract: null,
      editedContractDialog: false,
      isPerformEditContract: false,
      snackbar: false,
      snackbarMes: "",
      contractStatus: [ {text: 'Tất cả', value: ''}, {text: 'Đang cho thuê', value: 'inprogress'}, {text: 'Sắp thuê', value: 'incomming'}, {text: 'Đã hết hạn', value: 'closed'},],
      statusFilter: '',
      nextContract: {},
      editedCustomerDialog: false,
      incommingContracts: []
    };
  },
  mounted() {
    this.getContractPagination();
    console.log(this.houseObj.currentContract)
  },
  methods: {
    closeCustomerForm(data) {
      if (data) {
        this.editedCustomerDialog = false
      }
    },
    openContract(contract) {
      this.contractDialog = true
      this.editedContract = Object.assign({}, contract)
    },
    openEditedContractDialog(contract) {
      this.editedContract = Object.assign({}, contract)
      this.editedContractDialog = true
    },
    openCreateContractDialog(item) {  
      if (item) {
        this.editedContract = Object.assign({}, item)
      } else {
        this.editedContract = null
      }
      this.editedContractDialog = true
    },
    openEditCustomerDialog(item) {
      this.editedCustomerDialog = true
      this.editedContract = Object.assign({}, item)
    },
    closeContractForm(isCloseDialog) {
      if (isCloseDialog) {
        this.editedContractDialog = false
      }
    },
    createContract(data) {
      if (data.result) {
        this.getContractPagination()
        this.snackbar = true
        this.snackbarMes = data.message
        this.editedContractDialog = false
      } else {
        this.snackbar = true
        this.snackbarMes = data.message
      }
    },
    editCustomerInfo(data) {
      if (data.result) {
        this.getContractPagination()
        this.snackbar = true
        this.snackbarMes = data.message
        this.editedCustomerDialog = false
        
      }
    },
    async endContract() {
      const data = await contractRepository.closeContract(this.editedContract.id).then(res => {
        if (res.status === 200) {
          this.getContractPagination()
          this.snackbar = true
          this.snackbarMes = "Kết thúc hợp đồng thành công"
          this.confirmChangeStatusDialog = false
          this.$emit('endContract', true)
          
        }
      })
    },
    async startContract() {
      const data = await contractRepository.openContract(this.editedContract.id, this.houseObj.id).then(res => {
        if (res.status === 200) {
          this.getContractPagination()
          this.snackbar = true
          this.snackbarMes = "Mở hợp đồng thành công"
          this.confirmChangeStatusDialog = false
          this.$emit('openContract', true)
          
        }
      })
    },
    convertDateTime(datetime) {
      return `${this.convertDate(datetime)} (${this.convertTime(datetime)})`
    },
    resetForm() {
      this.addUserDialog = false;
      this.$refs.form.reset();
      this.$refs.form.resetValidation();
    },
    formatRoleName(role) {
      console.log("format");
      return this.getRoleName(role);
    },
    async getContractPagination() {
      const data = await contractRepository
        .getContractsByHouse(this.currentPage, this.pageSize, this.statusFilter, this.houseObj.id)
        .then(res => {
          if (res.status === 200) {
            this.listContracts = this.formatListContracts(res.data.result.data)
            if (this.statusFilter === '' || this.statusFilter === 'incomming') {
              this.incommingContracts = this.listContracts.filter(contract => {
                return contract.status === 'incomming'
              })
              console.log(this.incommingContracts)
              this.nextContract = this.incommingContracts[this.incommingContracts.length - 1]
            }
            this.totalPages = res.data.result.totalPages;
          }
        });
    },
    confirmChangeContractStatus(contract) {
      this.editedContract = Object.assign({}, contract)
      console.log(this.editedContract)
      this.confirmChangeStatusDialog = true
    },
    confirmRemoveItem(item) {
      this.editedContract = Object.assign({}, item);
      this.confirmRemoveDialog = true;
    },
    async removeContract() {
      const data = await contractRepository
        .removeContract(this.editedContract.id)
        .then(res => {
          if (res.status === 200) {
          this.getContractPagination()
          this.snackbar = true
          this.snackbarMes = "Xóa hợp đồng thành công"
          this.editedContractDialog = false
        }
        });
    },
    handlePaging(e) {
      this.currentPage = e;
    },
    closeCustomerDialog(data) {

    }
  },
  watch: {
    houseObj: function() {
      this.getContractPagination()
    },
    search: {
      handler: function() {
        this.getContractPagination();
      }
    },
    statusFilter: function() {
      this.getContractPagination(this.statusFilter)
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
        this.getContractPagination();
      }
      deep: true;
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