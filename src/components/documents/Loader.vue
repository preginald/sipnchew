<template>
  <div>
    <v-row v-for="(skeleton,i) in 2" :key="i">
      <!-- <v-col sm="12" md="9" lg="7"> -->
      <v-col>
        <v-skeleton-loader
          v-bind="attrs"
          type="article@2, actions"
          ></v-skeleton-loader>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Loader",
  computed: {
    ...mapState(["loading"]),
  },
  data: () => ({
    attrs: {
      boilerplate: false,
      elevation: 2,
    },
  })
};
</script>
