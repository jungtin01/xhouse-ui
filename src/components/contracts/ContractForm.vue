<template>
<div>
    <v-form ref="form" lazy-validation>
        <v-container class="px-6 pb-3 pt-0" grid-list-xs>
        <v-layout wrap>
            <v-flex xs12>
                <v-date-picker
                no-title
                :min="today"
                locale="vi-VN"
                landscape
                full-width
                v-model="dates"
                range
                ></v-date-picker>
            </v-flex>
            <v-flex xs6 pr-1>
                <v-text-field
                :value="computedStartDate"
                label="Ngày bắt đầu"
                hide-details
                prepend-icon="mdi-calendar-check"
                readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 pl-1>
                <v-text-field
                :value="computedEndDate"
                label="Ngày kết thúc"
                hide-details
                prepend-icon="mdi-calendar-check"
                readonly
                ></v-text-field>
            </v-flex>
            <v-flex xs6 pr-1>
                <v-text-field
                type="time"
                color="indigo"
                v-model="startTime"
                label="Giờ nhận phòng"
                :rules="timeRules"
                prepend-icon="mdi-clock"
                required
                ></v-text-field>
            </v-flex>
            <v-flex xs6 pl-1>
                <v-text-field
                type="time"
                color="indigo"
                v-model="endTime"
                label="Giờ trả phòng"
                prepend-icon="mdi-clock"
                :rules="timeRules"
                required
                ></v-text-field>
            </v-flex>
            <v-flex xs6 pr-1>
                <v-text-field
                type="number"
                color="indigo"
                v-model="rentalFee"
                label="Giá cho thuê"
                prepend-icon="mdi-cash-multiple"
                required
                ></v-text-field>
            </v-flex>
            <v-flex xs6 pl-1>
                <v-text-field
                type="number"
                color="indigo"
                v-model="deposit"
                label="Đặt cọc"
                prepend-icon="mdi-cash-multiple"
                required
                ></v-text-field>
            </v-flex>
            <v-flex xs12 v-if="editedContract === null">
                <v-card-title class="px-0">Khách hàng</v-card-title>
            </v-flex>
            <v-flex xs12 v-if="editedContract === null">
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
            </v-flex>
        </v-layout>
    </v-container>
</v-form>
<v-card-actions class="px-6 pb-3 pt-0">
          <v-spacer></v-spacer>
          <v-btn depressed dark color="blue darken-1" @click="closeForm">Đóng</v-btn>
          <v-btn
            depressed
            dark
            color="indigo darken-1"
            @click="editedContract !== null ? editContract() : createContract()"
          >Hoàn tất</v-btn>
        </v-card-actions>
        </div>
</template>
<script>
import {RepositoryFactory} from '@/repository/RepositoryFactory'
import { fail } from 'assert';
const contractRepository = RepositoryFactory.get('contract')
export default {
    props: {
        editedContract: {
            type: Object,
            default: () => {}
        },
        houseOwner: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            isEditingContract: false,
            dates: ["2019-10-15", "2019-10-15"],
            rentalFee: 0,
            deposit: 0,
            startDate: '',
            endDate: '',
            startTime: "12:00",
            endTime: "12:00",
            customerInfo: {},
            nameRules: [v => !!v || "Tên khách hàng không được để trống"],
            phoneRules: [v => !!v || "Số điện thoại không được để trống"],
            emailRules: [v => !!v || "Email không được để trống"],
            identifierRules: [v => !!v || "Chứng minh thư không được để trống"],
            addressRules: [v => !!v || "Địa chỉ nhà không được để trống"],
            priceRules: [v => !!v || "Giá nhà không được để trống"],
            timeRules: [v => !!v || "Thời gian không được để trống"],
            sizeRules: [v => !!v || "Sức chứa không được để trống"],
            unAbleVals: []
        }
    },
    computed: {
        computedStartDate() {
            return new Date(this.dates[0]) < new Date(this.dates[1])
            ? this.convertDate(this.dates[0])
            : this.convertDate(this.dates[1]);
        },
        computedEndDate() {
            return new Date(this.dates[0]) > new Date(this.dates[1])
            ? this.convertDate(this.dates[0])
            : this.convertDate(this.dates[1]);
        },
        today() {
            return this.convertDateForPicker(new Date());
        },
        tomorrow() {
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            return this.convertDateForPicker(tomorrow);
        }
    },
    async created() {
        const houseId = this.$route.params.id
        const {data} = await contractRepository.getContractsByHouse(NaN, NaN, 'incomming', houseId)
        let unAbleVals = []
        let listContract = data.result.data
        listContract.forEach(contract => {
            if (this.editedContract === null || 
            (this.editedContract !== null && 
            new Date(this.editedContract.startDate).getTime() != new Date(contract.startDate).getTime())) {
                for (let i = new Date(contract.startDate); i <= new Date(contract.endDate); i.setDate(i.getDate() + 1)) {
                    unAbleVals.push(this.convertDateForPicker(i))
                }
            }
        })
        localStorage.setItem("unAbleVals", unAbleVals)
    },
    async mounted() {
        this.assignEditingValue()
    },
    methods: {
        assignEditingValue() {
            if (this.editedContract) {
                this.isEditingContract = true
                this.rentalFee = this.editedContract.rentalFee
                this.deposit = this.editedContract.deposit
                this.startTime = this.convertTime(this.editedContract.startDate)
                this.endTime = this.convertTime(this.editedContract.endDate)
                this.dates = [this.convertDateForPicker(this.editedContract.startDate), this.convertDateForPicker(this.editedContract.endDate)]
            } else {
                this.resetForm()
            }
        },
        closeForm() {
            this.$emit('closeContractForm', true)
        },
        resetForm() {
            this.$refs.form.reset()
            this.$refs.form.resetValidation()
            this.deposit = this.houseOwner.price / 2
            this.rentalFee = this.houseOwner.price
            this.startTime = '14:00:00'
            this.endTime = '12:00:00'
            this.dates = [this.today, this.tomorrow]
        },
        async editContract() {
            if (this.$refs.form.validate()) {
                let comparedStartDate, comparedEndDate
            if (new Date(this.dates[0]) > new Date(this.dates[1])) {
                comparedStartDate = this.dates[1]
                comparedEndDate = this.dates[0]
            } else {
                comparedStartDate = this.dates[0]
                comparedEndDate = this.dates[1]
            }
            const startDateTime = new Date(`${comparedStartDate}T${this.startTime}`);
            const endDateTime = new Date(`${comparedEndDate}T${this.endTime}`);
            const contract = {
                startDate: startDateTime,
                endDate: endDateTime,
                rentalFee: this.rentalFee,
                deposit: this.deposit
            };
            const data = await contractRepository
                .updateContract(contract, this.editedContract.id, this.houseOwner.id)
                .then(res => {
                if (res.status === 200) {
                    const returnedData = {
                        result: true,
                        message: "Sửa hợp đồng thành công."
                    }
                    this.$emit('editContract', returnedData)
                    this.assignEditingValue()
                }
            },
            (error) => {
                if (error.response.status === 400) {
                    const returnedData = {
                        result: false,
                        message: error.response.data.message
                    }
                    this.$emit('editContract', returnedData)
                }
            });
            }
        },
        async createContract() {
            if (this.$refs.form.validate()) {
            let comparedStartDate, comparedEndDate
            if (new Date(this.dates[0]) > new Date(this.dates[1])) {
                comparedStartDate = this.dates[1]
                comparedEndDate = this.dates[0]
            } else {
                comparedStartDate = this.dates[0]
                comparedEndDate = this.dates[1]
            }
            const startDateTime = new Date(`${comparedStartDate}T${this.startTime}`);
            const endDateTime = new Date(`${comparedEndDate}T${this.endTime}`);
            const contract = {
                startDate: startDateTime,
                endDate: endDateTime,
                customerInfo: this.customerInfo,
                rentalFee: this.rentalFee,
                deposit: this.deposit
            };
            const data = await contractRepository
                .createContract(contract, this.houseOwner.id)
                .then((res) => {
                    console.log(res)
                if (res.status === 200) {
                    const returnedData = {
                        result: true,
                        message: "Thêm hợp đồng thành công."
                    }
                    this.$emit('createContract', returnedData)
                    this.assignEditingValue()
                } 
            },
            (error) => {
                if (error.response.status === 400) {
                    const returnedData = {
                        result: false,
                        message: error.response.data.message
                    }
                    this.$emit('createContract', returnedData)
                }
            });
      }
            // const data = await contractRepository.createContract()
        },
        allowedDates: val => {
            let unAbleVals = localStorage.getItem('unAbleVals')
            return unAbleVals.indexOf(val) === -1
        }
    },
    watch: {
        editedContract: function() {
            console.log(this.editedContract)
            this.assignEditingValue()
        },
        isPerformEditContract: function() {
            if (this.isPerformEditContract) {
                this.performEditContract()
            }
        },
    }
}
</script>
<style scoped>

</style>