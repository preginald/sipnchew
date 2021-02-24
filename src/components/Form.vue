<template>
  <v-row>
    <v-form>
      <v-container>
        <v-row>
          <v-col v-for="input in activeDoc.inputs" :key="input.name" cols="12" sm="3">
            <v-text-field
              :label="input.label"
              v-model="input.value"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-row>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState(["activeDoc"]),
  components: {},
  data: () => ({}),
};
</script>
