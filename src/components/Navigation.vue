<template>
    <v-app-bar app dense>
      <template v-if="nav"> 
        <v-btn icon :to="userLink"><v-icon>mdi-home-account</v-icon></v-btn>
      </template>
      <template v-else>
        <v-btn icon to="/"><v-icon>mdi-home</v-icon></v-btn>
      </template>

      <v-spacer></v-spacer>
      <template v-if="nav"> 
        <v-btn icon @click="createNewDoc()"><v-icon>mdi-plus</v-icon></v-btn>
        <v-btn icon @click="logout()"><v-icon>mdi-logout-variant</v-icon></v-btn>
      </template>
      <template v-else> 
        <v-btn icon to="/login"><v-icon>mdi-login-variant</v-icon></v-btn>
        <!-- <v-btn text to="/register">Sign up</v-btn> -->
      </template>
        <v-btn v-if="$vuetify.theme.dark" icon @click.prevent="toggleDarkMode"><v-icon>mdi-toggle-switch</v-icon></v-btn>
        <v-btn v-else icon @click.prevent="toggleDarkMode"><v-icon>mdi-toggle-switch-off-outline</v-icon></v-btn>
    </v-app-bar>

</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";
import router from "../router";

export default {
  name: "Navigation",

  computed: {
     ...mapState(["nav","userProfile","isOwner","userLink"]),
  },
  methods: {
    ...mapMutations(["setActiveDoc", "setTaskInputHint"]),
    ...mapActions(["toggleEditDoc","logout"]),
    createNewDoc(){
      let newDoc = {
        title: '',
        slug: '',
        description: '',
        status: 'edit',
        variableTag: 'vv',
        steps: [{title: 'First step', tasks: [{intro: {content: '', form: true}, input: {content: '', form: true}, output: {content: '', form: true},type: '',form: []}]}],
        inputs: [],
        create: true,
      }
      this.setActiveDoc(newDoc)
      this.setTaskInputHint("")
      router.push({
        name: "CreateDoc",
      });
    },
    init(){
      console.log()
    },
    toggleDarkMode(){
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      
    }
  },
  mounted() {
    this.init()
  }

}; </script>
