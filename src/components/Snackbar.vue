<template>
    <v-snackbar
      v-model="snackbar.status"
      :timeout="snackbar.timeout"
    >
      <span>{{ snackbar.text }}</span>

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="setSnackbar(false)"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "Snackbar",

  computed: {
     ...mapState(["snackbar"]),
  },
  methods: {
    ...mapMutations(["setSnackbar"]),
  },
  data: () => ({
    }),

}; </script>
