<template>
  <div>
    <v-row v-for="step in activeDoc.steps" :key="step.order">
      <v-col>
        <h3>{{ step.title }}</h3>
        <v-row v-for="task in step.tasks" :key="task.order">
          <v-col md="6">
            <kbd> {{ taskInterpreter(task.title) }}</kbd>
          </v-col>
          <v-col md="6" v-if="isOwner">
            <v-text-field v-model="task.title"></v-text-field>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-btn @click="updateSteps()">Update</v-btn>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: mapState(["activeDoc"]),
  components: {},
  data: () => ({
    step: 1,
  }),
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions(["updateSteps", "isOwner"]),
    init(){
      this.isOwner()
    },
    taskInterpreter(task) {
      let n = task.search("<variable>");
      if (n == -1) {
        return task;
      } else {
        let n = task.split("</variable>");
        let newTask = "";
        n.forEach((e) => {
          let x = e.search("<variable>");
          if (x == -1) {
            newTask += e;
          } else {
            let variable = this.getVariable(e);
            let value = this.getValue(variable);
            newTask += e.replace("<variable>" + variable, value);
          }
        });
        return newTask;
      }
    },
    getVariable(task) {
      let n = task.search("<variable>");
      if (n > -1) {
        let variable = task.substring(n + 10, task.length);
        return variable;
      }
    },
    getValue(name) {
      let n = this.activeDoc.inputs.find((e) => e.name == name);
      return n.value;
    },
    taskInterpreterBackup(task) {
      let n = task.search("<variable>");
      if (n == -1) {
        return task;
      } else {
        let variable = this.getVariable(task);
        let value = this.getValue(variable);
        return task.replace("<variable>" + n + "</variable>", value);
      }
    },
  },
};
</script>
