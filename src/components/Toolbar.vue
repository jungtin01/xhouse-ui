<template>
  <v-app-bar
    absolute
    style="padding-left: 80px"
    :height="72"
    class="v-toolbar--fixed"
    color="#f5f5f5"
    elevate-on-scroll
    scroll-target="#scrolling-techniques"
  >
  <v-card-title class="text-uppercase font-weight-bold pa-0">
    <img :src="appLogo" height="60" />
  </v-card-title>
    <v-spacer></v-spacer>
    <!-- <v-menu
        :close-on-content-click="true"
        offset-y bottom left
        transition="slide-y-transition"
        :eager="true"
        :close-on-click="true"
        >
        <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon color="grey">
        <v-badge color="red darken-1" right overlap> 
            <template v-slot:badge>10</template>
            <v-icon large>mdi-bell</v-icon>
        </v-badge>
        </v-btn>
        </template>
        <ListNotification 
            :pageSize="defaultLoadNotifications" />
    </v-menu> -->
    <v-toolbar-items class="align-center py-1 pr-3 ml-5">
      <v-menu bottom left offset-y transition="slide-y-transition">
      <template v-slot:activator="{on}">
      <a v-on="on">
        <span class="grey--text text--darken-3 mr-2 body-1">{{user.userName}}</span>
        <v-avatar :size="45">
          <img :src="chessLogo" />
        </v-avatar>
      </a>
      </template>
      <v-list>
        <v-list-item :to="'/dashboard/profile'">
          <v-list-item-title>Thông tin cá nhân</v-list-item-title>
        </v-list-item>
        <v-list-item @click="signOut">
          <v-list-item-title>Đăng xuất</v-list-item-title>
        </v-list-item>
      </v-list>
      </v-menu>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Toolbar',
  components:{},
  computed: {
    ...mapState({ user: state => state.user }),
  },
  data() {
    return {
      chessLogo: require('@/assets/images/chess.png'),
      appLogo: require('@/assets/images/rental_house.png'),
      items: [
        // {
        //   text: 'Dashboard',
        //   disabled: false,
        //   href: 'breadcrumbs_dashboard'
        // },
        // {
        //   text: 'Link 1',
        //   disabled: false,
        //   href: 'breadcrumbs_link_1'
        // },
        // {
        //   text: 'Link 2',
        //   disabled: true,
        //   href: 'breadcrumbs_link_2'
        // }
      ],
      defaultLoadNotifications:5
    }
  },
  methods: {
    signOut() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$store.commit('setUser', null)
      this.$router.push('/')
    }
  },
  watch:{
    '$route.meta.breadcrumb':{
      handler:function(){
        this.items = this.$route.meta.breadcrumb
        console.log(this.items)
      }
    }
  }
}
</script>

<style>
.v-breadcrumbs__item {
  color: #027beb !important;
}
.v-breadcrumbs__item--disabled {
  color: #bdbdbd !important;
}
.v-menu__content {
  border-radius: 10px;
}
.v-badge__badge {
  width: 25px;
  height: 25px !important;
  border-radius: 25px !important;
}
</style>
