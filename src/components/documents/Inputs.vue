<template>
  <v-card v-if="activeDoc.inputs.length" class="mb-3">
    <v-card-text>
      <v-row>
        <v-col v-for="input in activeDoc.inputs" 
          :key="input.name" 
          cols="6" sm="4" md="4" lg="4" xl="3">
          <v-text-field
        :label="input.label"
        v-model="input.value"
        :hint="input.name"
      ></v-text-field>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["activeDoc"]),
  },
  name: "Inputs",
  methods: {
  },
  data: () => ({
    // step: 1,
  }),
};
</script>

