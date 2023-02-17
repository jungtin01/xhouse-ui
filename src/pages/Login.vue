<template>
  <v-content>
    <v-card :elevation="8" align-end justify-center class="login-container">
        <v-layout row xs12 style="position:relative;height:100%;overflow:hidden">
          <v-flex :style="homeBackground" class="left-container" xs6>
          <v-overlay :value="overlay" :opacity="0.9" absolute color="#027beb" style="text-align:center">
              <h1 class="text-uppercase">xrentalhouse</h1>
              <hr class="horizontal-line"/>
              <p class="mt-3">Ứng dụng quản lý thuê nhà</p>
          </v-overlay>
      </v-flex>
      <v-flex xs6 style="align-self:center">
          <v-layout>
              <LoginField/>
          </v-layout>
      </v-flex>
      </v-layout>
    </v-card>
  </v-content>
</template>

<script>
import LoginField from '@/components/LoginField'
export default {
  components: {
    LoginField
  },
  data() {
    return {
        backgroundImage: require('@/assets/images/background.jpg'),
        overlay: true
    }   
  },
  computed: {
    homeBackground() {
      return {
          backgroundImage: `url(${this.backgroundImage})`,
          backgroundBlendMode: 'multiply',
          backgroundPosition: `center center`,
          backgroundSize: `cover`,
          height: '100%',
          position: 'relative',
          overflow: 'hidden'
      }
    }
  }
}
</script>

<style scoped>
.horizontal-line {
    border: 2px solid #fff;    
    width: 80%;
    margin: auto;
}
.login-container {
    width: 50%;
    height: 600px;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    /* border-radius: 15px !important; */
}
@media screen and (max-width: 1400px) {
    .login-container {
        width: 50%;
        height: 450px;
    }
}
</style>
