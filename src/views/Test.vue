<template>
  <v-container>
    <Heading />
    <Form v-if="activeDoc" />
    <Flat />
    <Stepper v-if="false" />
  </v-container>
</template>

<script>
import { docsCollection } from  '../firebase'
import { mapState, mapActions } from "vuex";
import Heading from "../components/documents/Heading";
import Form from "@/components/Form";
import Stepper from "@/components/Stepper";
import Flat from "../components/Flat";

export default {
  computed: mapState(["activeDoc"]),
  name: "Home",
  components: { 
    Heading, 
    Form, 
    Stepper, 
    Flat 
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(['fetchActiveDoc', 'isOwner']),
     async updateUserDoc(doc){
      await docsCollection.doc(doc.id).update({
        inputs: this.doc.inputs,
        steps: this.doc.steps,
      })
    },
    init(){
      if(typeof this.activeDoc.length == 'undefined'){
       this.fetchActiveDoc(this.$route.params)
      }
      this.isOwner()
    },
  },
  data: () => ({
    // step: 1,
  }),
};
</script>
