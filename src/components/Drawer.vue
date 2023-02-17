<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    dark
    floating
    src="@/assets/images/background.jpg"
    permanent
    mini-variant
    color="#027beb"
  >
    <v-layout column justify-space-between style="height:100%">
      <v-list class="logo-area">
        <v-list-item :to="'/'">
          <v-list-item-title class="logo--text text-center font-weight-bold text-uppercase"></v-list-item-title>
          <!--logo-->
        </v-list-item>
      </v-list>
      <v-list dense v-if="user.userRole === 3">
        <v-list-item
          v-for="item in items.list3"
          :key="item.title"
          link
          :to="item.path"
          class="justify-center list-item"
        >
          <v-list-item-action class="mr-0 my-5" align-center>
            <v-icon large>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list dense v-if="user.userRole === 5">
        <v-list-item
          v-for="item in items.list5"
          :key="item.title"
          link
          :to="item.path"
          class="justify-center list-item"
        >
          <v-list-item-action class="mr-0 my-5" align-center>
            <v-icon large>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list dense v-if="user.userRole === 10">
        <v-list-item
          v-for="item in items.list10"
          :key="item.title"
          link
          :to="item.path"
          class="justify-center list-item"
        >
          <v-list-item-action class="mr-0 my-5" align-center>
            <v-icon large>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list>
        <v-list-item class="justify-center">
          <v-list-item-action class="mr-0 my-5" align-center>
            <v-icon @click="signOut" large>mdi-logout-variant</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-layout>
  </v-navigation-drawer>
</template>

<script>
import { mapState } from "vuex";
import Loader from "@/components/Loader";
export default {
  components: {
    Loader
  },
  data() {
    return {
      chessLogo: require("@/assets/images/chess.png"),
      loader: false,
      drawer: true,
      items: {
        list3: [
          {
            icon: "mdi-home-city",
            path: "/dashboard/houses"
          }
        ],
        list5: [
          // {
          //   icon: "mdi-chart-arc",
          //   path: "/dashboard/statistics"
          // },
          {
            icon: "mdi-home-city",
            path: "/dashboard/houses"
          },
          {
            icon: "mdi-account-supervisor",
            path: "/dashboard/users"
          }
        ],
        list10: [
          // {
          //   icon: "mdi-chart-arc",
          //   path: "/dashboard/statistics"
          // },
          {
            icon: "mdi-account-supervisor",
            path: "/dashboard/users"
          }
        ]
      },
      dialog: false
    };
  },
  computed: {
    ...mapState({ user: state => state.user })
  },
  mounted() {
    // this.loader = true
    // this.loader = false
  },
  methods: {
    signOut() {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.$store.commit('setUser', null)
      this.$router.push('/')
    },
  }
};
</script>

<style scoped>
.title-header {
  text-align: center !important;
}
.title-header-parent {
  opacity: 1 !important;
}
>>> .primary--text {
  max-width: 300px;
}
</style>
<style>
.v-navigation-drawer__content {
  justify-content: center;
}
.v-navigation-drawer__image {
  opacity: 0.1;
}
.v-image__image--cover {
  background-position-x: left;
}
.logo-area {
  height: 72px;
}
.logo--text {
  font-size: 1.7rem;
}
.v-list-item__icon {
  width: 25px;
}
</style>