<template>
  <v-container>
    <v-row> <v-col>
        <h2>Register</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-form @submit.prevent>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model.trim="signupForm.username"
                required
                label="username"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                type="email"
                v-model.trim="signupForm.email"
                required
                label="email"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                type="password"
                v-model="signupForm.password"
                label="password"
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-btn @click="signup()">Sign up</v-btn>
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
export default {
  name: "Signup",
  data: () => ({
    signupForm: {
      username: "",
      email: "",
      password: "",
      },
  }),
  methods: {
    signup(){
      this.$store.dispatch('signup', {
        email: this.signupForm.email,
        password: this.signupForm.password,
        username: this.signupForm.username,
      })
    },
  },
};
</script>
