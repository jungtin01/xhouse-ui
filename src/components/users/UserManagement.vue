<template>
  <v-container>
    <PageTitle :title="'Quản lý người dùng'" :searchDisable="true" @search="handleSearch($event)" :searchInput="search"/>
    <v-flex xs12 justify-center ma-auto>
        <v-container>
          <v-card class="pa-5" :elevation="8">
            <UserDataTable :search="search"/>
          </v-card>
          <v-flex pl-2 xl10 justify-center ma-auto>
    </v-flex>
        </v-container>
    </v-flex>
        
  </v-container>
</template>

<script>
import PageTitle from '@/components/kit/PageTitle'
import UserDataTable from './UserDataTable'
export default {
  components: {
    UserDataTable,
    PageTitle
  },
  data () {
    return  {
      search: ''
    }
  },
  created() {
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 10px;
}
</style>
