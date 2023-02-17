<template>
  <v-layout column class="align-center">
      <v-avatar :size="100">
      <img :src="avatarImage" alt="avatar">
    </v-avatar>
    <v-card-text class="profile-highlight-container">
      <p class="mb-0 headline font-weight-medium grey--text text--darken-2">{{user.userName}}</p>
      <p class="body-1 font-weight-medium grey--text">{{formatRoleName}}</p>
    </v-card-text>
    
  </v-layout>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props:{
    userInput:{
      required:false,
      type:Object,
      default:null
    },
    changeHeight: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      randomBg: 1,
      backgroundImage: require(`@/assets/images/house.jpg`),
      avatarImage: require(`@/assets/images/chess.png`),
    }
  },
  computed: {
    ...mapState({ user: state => state.user }),
    formatRoleName() {
        return this.getRoleName(this.user.userRole)
    }
  },
  created() {
  }
}
</script>

<style scoped>
.v-avatar {
  align-items: center;
}
.profile-highlight-container p {
  text-align: center;
}
@media(min-width: 1904px) {
}
>>> input {
  color: #757575 !important;
}
</style>
