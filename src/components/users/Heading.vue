<template>
  <v-row>
    <v-col>
      <h2 class="text-h6">
        {{ this.$route.params.userName }}
      </h2>
    </v-col>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState(["userProfile"]),
};
</script>
