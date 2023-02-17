<template>
  <v-container>
    <PageTitle :title="'Thông tin cá nhân'" :searchDisable="true"/>
    <v-fade-transition leave-absolute>
    <v-card :elevation="0">
    <v-layout align-start justify-space-between v-if="user != null" class="py-2">
      <v-flex xs4 pt-5>
        <v-layout>
          <v-flex>
            <HighlightProfile/>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-divider
      inset
      vertical
    ></v-divider>
      <v-flex xs8 pl-5>
        <ProfileInfo :isInstructor="this.user.roleId === 1"/>
      </v-flex>
    </v-layout>
    </v-card>
        </v-fade-transition>
  </v-container>
</template>

<script>
import HighlightProfile from './profile-pieces/HighlightProfile'
import ProfileInfo from './profile-pieces/ProfileInfo'
import PageTitle from '@/components/kit/PageTitle'
import { mapState } from 'vuex'
export default {
  components: {
    HighlightProfile,
    ProfileInfo,
    PageTitle,
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({ user: state => state.user })
  }
}
</script>

<style scoped>
.xs4 {
  max-width: 31.5%;
}
</style>
