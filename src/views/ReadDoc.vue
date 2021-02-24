<template>
  <v-container>
    <Heading />
    <v-divider class="my-3"></v-divider>
    <v-row v-if="Object.keys(activeDoc).length">
      <v-col sm="4" md="2">
        <v-card v-if="editDoc" class="mb-1">
          <v-card-title class="text-h7">Inputs</v-card-title>
          <v-card-text>
            <v-row>
              <v-col sm="12">
                <v-text-field label="label" v-model="inputLabel"></v-text-field>
              </v-col>
              <v-col sm="12">
                <v-text-field label="name" v-model="inputName"></v-text-field>
              </v-col>
              <v-col sm="12">
                <v-text-field label="value" v-model="inputValue"></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="addInput()">Add input</v-btn>
          </v-card-actions>
        </v-card>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col v-for="input in activeDoc.inputs" :key="input.name" sm="12">
                <v-text-field
              :label="input.label"
              v-model="input.value"
              :hint="input.name"
            ></v-text-field>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col sm="8" md="10">

    <v-toolbar dense v-if="isOwner" class="mb-3">
        <v-spacer></v-spacer>
        <template v-if="editDoc">
                <v-btn v-if="activeDoc.status=='delete'" @click="deleteDoc(activeDoc)" class="mx-1"><v-icon>mdi-trash-can-outline</v-icon></v-btn>
                <v-btn v-else @click="softDeleteDoc(activeDoc)" class="mx-1"><v-icon>mdi-recycle</v-icon></v-btn>
                <v-btn :disabled="disabled()" @click="updateDoc(activeDoc)" class="mx-1">Update</v-btn>
                <v-btn v-if="activeDoc.status=='draft'" :disabled="disabled()" @click="publish(activeDoc)" color="green" class="mx-1">Publish</v-btn>
        <v-btn  @click="toggleEditDoc()"><v-icon>mdi-pencil-remove</v-icon></v-btn>
        </template>
        <template v-else>
          <v-btn  @click="toggleEditDoc()" v-if="isOwner && this.$route.name == 'UserDoc'"><v-icon>mdi-pencil-outline</v-icon></v-btn>
        </template>
    </v-toolbar>
        <v-row v-if="editDoc">
          <v-col md="6" >
            <v-text-field label="Title" :rules="rules.title" v-on:keyup="titleToSlug" v-model="activeDoc.title"></v-text-field>
            <v-text-field label="Slug" :rules="rules.slug" :error-messages="slugHint" persistent-hint v-on:keyup="slugCheck(activeDoc.slug)" v-model="activeDoc.slug"></v-text-field>
            <v-textarea label="Description" v-model="activeDoc.description"></v-textarea>
          </v-col>
        </v-row>

        <v-card v-for="(step, i) in activeDoc.steps" v-bind:key="i" class="mb-3">
          <v-card-title v-if="!editDoc" class="mb-3">{{stepNumber(i)}}: {{ step.title}}</v-card-title>
          <v-app-bar flat v-if="editDoc">
            <v-toolbar-title>{{stepNumber(i)}}: {{ step.title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon v-if="i > 0" @click="deleteStep(i)"><v-icon>mdi-delete</v-icon></v-btn>
          </v-app-bar>
          <v-card-text>
            <v-row>
              <v-col sm="12" :md="md()" lg="6" v-if="editDoc">
                <v-text-field label="Title" v-model="step.title"></v-text-field>
                <v-card-title class="text-h9">{{ step.tasks.length }} Tasks</v-card-title>
              </v-col>
            </v-row>
            <v-card v-for="(task, taskKey) in step.tasks" :key="taskKey" class="mb-3">
              <v-card-text>
                <v-row>
                  <v-col md="6" v-if="editDoc">
                    <v-toolbar>
                      <v-select hide-details label="type" v-model="task.type" :items="taskTypes"></v-select>
                    </v-toolbar>
                    <v-textarea v-model="task.title" :hint="taskTitleInputHint" :rows="rows(task.title)"></v-textarea>
                  </v-col>
                  <v-col sm=12 :md="md()" lg="12">
                    <v-sheet v-clipboard:copy="taskInterpreter(task.title)" v-clipboard:success="onCopy" v-clipboard:error="onError" elevation="1" :class="taskContainerClass"><span :class="task.type">{{ taskInterpreter(task.title) }}</span></v-sheet>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions v-if="editDoc"> 
                <v-row>
                  <v-col md="2">
                    <v-btn v-if="taskKey == (step.tasks.length - 1)" @click="addTask(i)">Add task</v-btn>
                  </v-col>
                </v-row>
              </v-card-actions>
            </v-card>
            <v-card-actions v-if="editDoc">
              <v-btn v-if="i == (activeDoc.steps.length - 1)" @click="addStep()">Add step</v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>

      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Heading from "../components/documents/Heading";

export default {
  computed: {
    ...mapState(["activeDoc", "userLink","userProfile", "isOwner", "editDoc","docValidation"]),
  },
  name: "Home",
  components: { 
    Heading, 
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(['loadUserDoc','updateDoc','deleteDoc', 'softDeleteDoc','slugCheck','toggleEditDoc']),
    init(){
      this.loadUserDoc(this.$route.params)
    },
    publish(){
      this.activeDoc.status = 'publish'
      this.updateDoc(this.activeDoc)
    },
    onCopy() {
      console.log('You just copied')
    },
    onError() {
      console.log('Error copy')
    },
    disabled(){
      if(this.docValidation.slug){
        this.slugHint = "Slug already exists"
        return  'disabled'
      } else {
        this.slugHint = null
        return  false
      }
    },
    md(){
      if(this.editDoc) {
        return 6
      } else {
        return 12
      }
    },
    rows(task){
      return task.split(/\r\n|\r|\n/).length
    },
    titleToSlug(){
      this.activeDoc.slug = this.activeDoc.title.replace(/\s+/g, '-').toLowerCase();
      this.slugCheck(this.activeDoc.slug)
    },
    inputLabelToName(){
      this.inputName = this.inputLabel.replace(/\s+/g, '-').toLowerCase();
    },
    stepNumber(i){
      return 'Step '  + parseInt(i + 1)  
    },
    addInput(){
      this.activeDoc.inputs.push({label: this.inputLabel, name: this.inputName, value: this.inputValue})
      this.taskTitleInputHint = this.activeDoc.inputs.map(input => {return input.name}).join(' ')
      this.inputLabel = ''
      this.inputName = ''
      this.inputValue = ''
    },
    addStep(){
      this.activeDoc.steps.push({title: '', tasks: [{title: ''}]})
    },
    deleteStep(i){
      this.activeDoc.steps.splice(i,1)
    },
    addTask(i){
      this.activeDoc.steps[i].tasks.push({title: ''})
    },
    taskInterpreter(task) {
      const openTag = "<" + this.activeDoc.variableTag + ">"
      const closeTag = "</" + this.activeDoc.variableTag + ">"

      let n = task.search(openTag);
      if (n == -1) {
        return task;
      } else {
        let open = task.split(openTag)
        let n = task.split(closeTag);
        let newTask = "";
        if(open.length == n.length){
        n.forEach((e) => {
          let x = e.search(openTag);
          if (x == -1) {
            newTask += e;
          } else {
            let variable = this.getVariable(e);
            let value = this.getValue(variable);
            newTask += e.replace(openTag+ variable, value);
          }
        });
        return newTask;

        }
      }
    },
    getVariable(task) {
      const openTag = "<" + this.activeDoc.variableTag + ">"
      let n = task.search(openTag);

      if (n > -1) {
        let variable = task.substring(n + openTag.length, task.length);
        return variable;
      }
    },
    getValue(name) {
      let n = this.activeDoc.inputs.find((e) => e.name == name);
      return n.value;
    },
  },
  watch: {
    inputLabel(){
      this.inputLabelToName()
    },
  },
  data: () => ({
    title: '',
    inputLabel: '',
    inputName: '',
    inputValue: '',
    taskTitleInputHint: '',
    taskContainerClass: 'pre',
    taskTypes: ['bash','html','js','mysql','php','yml'],
    slugHint: '',
    rules: {
      title:[
        (value) => !!value || "Required",
        (value) => value.length < 50 || "Max 50 characters",
      ],
      slug:[
        (value) => !!value || "Required",
        (value) => value.length < 50 || "Max 50 characters",
      ],
    },
    doc: {
      title: '',
      slug: '',
      description: '',
      variableTag: 'vv',
      steps: [{title: 'First step', tasks: [{title: '', type: ''}]}],
      inputs: [],
    }
    // step: 1,
  }),
};
</script>

<style scoped>

.pre {
  display: block;
  white-space: normal;
  font-family: "Roberto Mono", Monaco, courier, monospace;
  padding: 1.2em 1.4em;
  font-size: 0.85rem;
  position: relative;
}

.pre .html {
  white-space: pre;
}

.pre .js {
  white-space: pre;
}

.pre .php {
  white-space: pre;
}

.pre .js {
  white-space: pre;
}

.bash::before {
  content: "Shell";
}

.html::before {
  content: "HTML";
}

.js::before {
  content: "JS";
}

.mysql::before {
  content: "MySQL";
}

.php::before {
  content: "PHP";
}

.yml::before {
  content: "YML";
}

.pre ::before {
  font-family: "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  position: absolute;
  top: 0;
  right: 0;
  color: #ccc;
  text-align: right;
  font-size: 0.8em;
  padding: 5px 10px 0;
  line-height: 15px;
  height: 15px;
  font-weight: 600;
}

</style>
