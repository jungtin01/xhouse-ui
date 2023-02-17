<template>
    <v-layout wrap>
        <v-flex xs4 class="font-weight-medium grey--text">
            <p>Tên nhà:</p>
        </v-flex>
        <v-flex xs8 class="text-center">
            <p>{{contract.houseOwner.houseName}}</p>
        </v-flex>
        <v-flex xs4 class="font-weight-medium grey--text">
            <p>Người tạo:</p>
        </v-flex>
        <v-flex xs8 class="text-center">
            <p>{{contract.signer.name}}</p>
        </v-flex>
        <v-flex xs4 class="font-weight-medium grey--text">
            <p>Tên khách hàng:</p>
        </v-flex>
        <v-flex xs8 class="text-center">
            <p>{{contract.customer.cusName}}</p>
        </v-flex>
        <v-flex xs4 class="font-weight-medium grey--text">
            <p>Email:</p>
        </v-flex>
        <v-flex xs8 class="text-center">
            <p>{{contract.customer.email}}</p>
        </v-flex>
        <v-flex xs4 class="font-weight-medium grey--text">
            <p>Số điện thoại:</p>
        </v-flex>
        <v-flex xs8 class="text-center">
            <p>{{contract.customer.phoneNums}}</p>
        </v-flex>
        <v-flex xs4 class="font-weight-medium grey--text">
            <p>Chứng minh thư (Passport):</p>
        </v-flex>
        <v-flex xs8 class="text-center">
            <p>{{contract.customer.identifier}}</p>
        </v-flex>
        <v-flex xs4 class="font-weight-medium grey--text">
            <p>Địa chỉ:</p>
        </v-flex>
        <v-flex xs8 class="text-center">
            <p>{{contract.customer.address}}</p>
        </v-flex>
        <v-flex xs4 class="font-weight-medium grey--text">
            <p>Giá thuê / ngày:</p>
        </v-flex>
        <v-flex xs8 class="text-center">
            <p>{{contract.rentalFee}}</p>
        </v-flex>
        <v-flex xs4 class="font-weight-medium grey--text">
            <p>Đặt cọc:</p>
        </v-flex>
        <v-flex xs8 class="text-center">
            <p>{{contract.deposit}}</p>
        </v-flex>
        <v-flex xs4 class="font-weight-medium grey--text">
            <p>Thời gian thuê:</p>
        </v-flex>
        <v-flex xs8 class="text-center">
            <p>{{formatDurationDate}}</p>
        </v-flex>
        <v-flex xs4 class="font-weight-medium grey--text">
            <p>Trạng thái:</p>
        </v-flex>
        <v-flex xs8 class="text-center">
            <v-chip
          class="ma-2"
          label
          dark
          small
          :color="contract.color"
        >{{contract.statusName}}</v-chip>
        </v-flex>
    </v-layout>     
</template>

<script>

export default {
    props: {
        contract: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            dates: ["2019-10-15", "2019-10-17"]
        }
    },
    computed: {
        formatDurationDate() {
            return `${this.convertDate(this.contract.startDate)} (${this.convertTime(this.contract.startDate)}) ~ ${this.convertDate(this.contract.endDate)} (${this.convertTime(this.contract.endDate)})`
        }
    }
}
</script>
<style scoped>

</style>