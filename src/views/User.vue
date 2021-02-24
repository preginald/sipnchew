<template>
  <v-container>
    <Heading />
    <v-divider class="my-3"></v-divider>
    <v-row>
      <v-col sm="12" md="9" lg="7">
        <v-card v-if="userDocs">
          <v-list dense>
            <v-subheader>{{ userDocs.length }} docs</v-subheader>
            <v-list-item-group v-model="selected">
              <v-list-item @click.prevent="loadUserDoc(doc)" two-line v-for="(doc, i) in userDocs" :key="i">
                <v-list-item-icon>
                  <v-icon v-text="status(doc.status)"></v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>
                    <a  :href="docLink(doc)">{{
                      doc.title
                    }}</a>
                  </v-list-item-title>
                  <v-list-item-subtitle>{{doc.description}}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
        <v-card v-else>
          <Loader class="mt-3"/>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState,  mapActions } from "vuex"
import Heading from "../../src/components/users/Heading";
import Loader from "../components/documents/Loader";

export default {
  computed: mapState(["userDocs"]),
  components: { Heading, Loader },
  data: () => ({
    selected: '',
  }),
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(['fetchUserDocs','loadUserDoc']),
    init(){
      this.fetchUserDocs(this.$route.params)
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
