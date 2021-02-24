<template>
  <v-container>
    <v-row>
      <v-col>
        <v-btn @click="processTaskForm()">Convert</v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="6">
        <pre class="pre">{{ activeDoc }}</pre>
      </v-col>
      <v-col sm="6">
        <pre class="pre" v-if="newDoc">{{ newDoc }}</pre>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["activeDoc", "userLink","userProfile", "isOwner", "docValidation"]),
  },
  name: "TestDoc",
  mounted() {
    this.init()
  },
  methods: {
    ...mapMutations(['setActiveDoc']),
    ...mapActions(['loadUserDoc','createDoc','updateDoc','deleteDoc', 'softDeleteDoc','slugCheck','toggleCreateDoc','toggleEditDoc']),
    init(){
      console.log(this.$route.name)
      if(this.$route.name === "TestDoc"){
        this.loadUserDoc(this.$route.params)
      }
    },
    processTaskForm(){
      this.newDoc = JSON.parse(JSON.stringify(this.activeDoc))

      // convert tasks
      this.newDoc.steps.forEach(step => {
        step.tasks.forEach(task => {
          let intro = ""
          let input = ""
          let output= ""

          if('title' in task){
            if(task.title.length > 0){
              input = task.title 
            }
            console.log('deleted title')
            delete task.title
          }
          if('intro' in task){
            intro = task.intro
          }

          if('input' in task){
            input = task.input
          }
          if('output' in task){
            output = task.output
          }

          task.intro = {content: intro, form: false}
          task.input = {content: input, form: false}
          task.output = {content: output, form: false}
        })
      })

      // related id
      this.newDoc.relatedId = this.newDoc.id

      // remove id
      delete this.newDoc.id

      this.activeDoc.slug = this.activeDoc.slug + "-" + this.activeDoc.id
      if(this.activeDoc.status === "publish"){
        this.activeDoc.status = "delete"
      }

      // update original doc
      this.updateDoc(this.activeDoc)

      // save new doc
      this.createDoc(this.newDoc)
    }
  },
  data: () => ({
    newDoc: null,
    taskForm: [{intro: false, input: false, output: false}],
    // step: 1,
  }),
};
</script>

<style scoped>
.pre {
  overflow-y: hidden;
}
</style>
