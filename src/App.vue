<template>
  <v-app>
    <v-content>
      <Loader v-if="$store.state.loader" />
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
import Loader from '@/components/Loader'
import Footer from '@/components/Footer'

export default {
  name: 'app',
  components: {
    Loader, Footer
  }
}
</script>
