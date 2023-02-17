<template>
  <v-form ref="form" v-model="loginForm" class="ma-auto" style="width:80%" lazy-validation>
    <v-layout align-center class="xs12" wrap>
      <v-flex xs12>
        <span class="text-xs-center text-uppercase font-weight-bold login-title mb-4">Đăng nhập</span>
      </v-flex>
      <v-flex xs12>
        <v-text-field v-model="username" :rules="usernameRules" label="Tên đăng nhập"></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field type="password" v-model="password" :rules="passwordRules" label="Mật khẩu"></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue accent-3" @click="signIn" depressed dark>Đăng nhập</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-flex>
    </v-layout>
  </v-form>
</template>

<script>
import Repository, { setAuthorizationHeader } from '@/repository/Repository'
import { RepositoryFactory } from "@/repository/RepositoryFactory";
const userRepository = RepositoryFactory.get("user");
export default {
  created() {},
  data() {
    return {
      loginForm: true,
      username: "testowner",
      password: "firstowner",
      usernameRules: [v => !!v || "Tên đăng nhập không được để trống"],
      passwordRules: [v => !!v || "Mật khẩu không được để trống"]
    };
  },
  computed: {},
  methods: {
    async signIn() {
      if (this.$refs.form.validate()) {
        let user = {
          username: this.username,
          password: this.password
        };
        const data = await userRepository.signIn(user).then(res => {
          if (res.status === 200) {
            const token = res.data.result.token
            console.log(res.data)
            localStorage.setItem('token', token)
            setAuthorizationHeader(Repository, token.trim())
            let user = {
              userRole: res.data.result.role,
              userId: res.data.result.userId,
              userName: res.data.result.userName
            }
            localStorage.setItem('user', JSON.stringify(user))
            this.$store.commit('setUser', user)
            if (user.userRole === 10) {
              this.$router.push("/dashboard/users")
            } else {
              this.$router.push("/dashboard/houses")
            }
          }
        })
      }
    }
  }
};
</script>

<style scoped>
.login-title {
  font-size: 28px;
  line-height: 1.2;
  text-align: center;
  text-transform: uppercase;
  display: block;
}
.v-card {
  border-radius: 7px;
}
.text-note {
  color: #6c757d !important;
}
</style>
