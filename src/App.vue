<template>
  <v-app>
    
    <Navigation></Navigation>

    <v-main>
      <router-view />
      <Snackbar />
    </v-main>
  </v-app>
</template>

<script>
import Navigation from "./components/Navigation"
import Snackbar from "../src/components/Snackbar.vue";

export default {
  name: "App",
  components: { Navigation, Snackbar },

};
</script>
