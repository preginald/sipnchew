<template>
    <v-row>
      <v-col v-if="this.$route.name == 'ReadDoc'">
        <h2 class="text-h6">
          <router-link class="text-decoration-none" :to="userLink">{{
            activeDoc.username
            }}</router-link>
          <span v-if="activeDoc.title"> / </span >
          <router-link v-if="Object.keys(activeDoc).length" class="text-decoration-none" :to="$route.params.docSlug">{{
            activeDoc.title
            }}</router-link>
        </h2>
      </v-col>
      <v-col v-else>
        <h2 class="text-h6">
          <router-link class="text-decoration-none" :to="userLink">{{
            userProfile.username
            }}</router-link>
          <template v-if="activeDoc.title"> / {{ activeDoc.title }} </template >
        </h2>
      </v-col>
    </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["activeDoc","userLink", "userProfile"]),
  },
  components: {},
  data: () => ({}),
  methods: {
  },
};
</script>
