<template>
  <v-app>
    <Toolbar/>
    <Drawer />
    <v-content style="padding-top: 72px;padding-bottom: 80px;padding-left:80px">
      <Content />
    </v-content>
    <Footer/>
  </v-app>
</template>
<script>

import Drawer from '@/components/Drawer'
import Content from '@/components/Content'
import Toolbar from '@/components/Toolbar'
import Footer from '@/components/Footer'
export default {
  components: {
    Drawer,
    Content,
    Toolbar,
    Footer
  },
  data() {
    return {
    }
  },
  computed: {
    
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
<style>
*,
html {
  font-family: 'Heebo', sans-serif;
}
.v-btn__content {
  font-family: 'Roboto', sans-serif;
}
.v-dialog--fullscreen {
  /* overflow-y: hidden !important; */
}
@-moz-document url-prefix() {
  /* Disable scrollbar Firefox */
  html {
    scrollbar-width: none;
  }
}
*::-webkit-scrollbar {
  /** Webkit */
  width: 5px !important;
}
/* .cg-board .black, .cg-board .white, .blue.merida {
  background-color: transparent !important;
} */
</style>