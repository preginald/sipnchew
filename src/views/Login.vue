<template>
  <v-container>
    <v-row> <v-col>
        <h2>Login</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-form @submit.prevent>
        <v-container>
          <v-row>
          </v-row>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                type="email"
                v-model.trim="loginForm.email"
                required
                label="email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                type="password"
                v-model.trim="loginForm.password"
                label="password"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn @click="login(loginForm)">Sign in</v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-row>
    <v-row>
      <v-col>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: "Login",
  data: () => ({
    loginForm: {
      email: "",
      password: "",
      },
  }),
  methods: { 
    ...mapActions(['login']),
  },
};
</script>
