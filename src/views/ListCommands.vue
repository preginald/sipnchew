<template>
  <v-container>
    <h2 class="text-h6">
      Commands
    </h2>
    <v-divider class="my-3"></v-divider>
    <v-row>
      <v-col sm="12" md="9" lg="7">
        <v-card>
          <v-list dense>
            <v-list-item-group v-model="selected">
              <v-list-item @click.prevent="loadCommand(command)" two-line v-for="(command, i) in commands" :key="i">
              <!-- <v-list-item two-line v-for="(command, i) in commands" :key="i"> -->

                <v-list-item-content>
                  <v-list-item-title>
                    <a  :href="command.slug">{{
                      command.name
                    }}</a>
                  </v-list-item-title>
                  <v-list-item-subtitle>{{  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState,  mapActions } from "vuex"
// import Heading from "../../src/components/users/Heading";
// import Loader from "../components/documents/Loader";

export default {
  computed: mapState(["commands"]),
  // components: { Loader },
  data: () => ({
    selected: '',
  }),
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(['fetchCommands','fetchCommand','loadCommand']),
    init(){
      this.fetchCommands()
    },
    status(status) {
      let icon = ""
      switch(status){
        case 'publish':
          icon = "mdi-file-outline"
        break;
        case 'draft':
          icon = "mdi-file-edit-outline"
        break;
        case 'delete':
          icon = "mdi-file-remove-outline"
        break;
      }
      return icon
    },
    docLink(doc) {
      return this.$route.params.userName + "/" + doc.slug;
    },
  },
};
</script>
