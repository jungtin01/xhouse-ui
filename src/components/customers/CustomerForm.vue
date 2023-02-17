<template>
    <v-container class="pa-5">
        <v-layout wrap>
            <v-flex xs12>
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
    <v-card-actions class="px-0 pb-3 pt-0">
          <v-spacer></v-spacer>
          <v-btn depressed dark color="blue darken-1" @click="closeForm">Đóng</v-btn>
          <v-btn
            depressed
            dark
            color="indigo darken-1"
            @click="editCustomer"
          >Hoàn tất</v-btn>
        </v-card-actions>
    </v-container>
</template>

<script>
import {RepositoryFactory} from '@/repository/RepositoryFactory'
const customerRepository = RepositoryFactory.get('customer')
export default {
    props: {
        contractObj: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            customerInfo: {},
            nameRules: [v => !!v || "Tên khách hàng không được để trống"],
            phoneRules: [v => !!v || "Số điện thoại không được để trống"],
            emailRules: [v => !!v || "Email không được để trống"],
            identifierRules: [v => !!v || "Chứng minh thư không được để trống"],
            addressRules: [v => !!v || "Địa chỉ nhà không được để trống"],
        }
    },
    mounted() {
        this.customerInfo = this.contractObj.customer
        console.log(this.contractObj)
    },
    methods: {
        closeForm() {
            this.$emit('closeCustomerForm', true)
        },
        async editCustomer() {
            const data = await customerRepository.editInfo(this.customerInfo, this.contractObj.id).then(res => {
                if (res.status === 200) {
                    const returnedData = {
                        result: true,
                        message: "Sửa thông tin khách hàng thành công."
                    }
                    this.$emit('editCustomerInfo', returnedData)
                }
            })
        }
    }
}
</script>
<style scoped>

</style>