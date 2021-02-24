<template>
  <v-stepper v-model="step">
    <v-stepper-header>
      <template v-for="step in activeDoc.steps">
        <v-stepper-step :key="step.order" :step="step.order" editable>
          {{ step.title }}
        </v-stepper-step>
        <v-divider
          v-if="step.order !== activeDoc.steps.length"
          :key="step.title"
        ></v-divider>
      </template>
    </v-stepper-header>
    <v-stepper-items v-for="step in activeDoc.steps" :key="step.order">
      <v-stepper-content :step="step.order">
        <v-row>
          <v-col>
            <h3>{{ step.title }}</h3>
          </v-col>
        </v-row>
        <v-row v-for="task in step.tasks" :key="task.order">
          <v-col>
            <kbd> {{ taskInterpreter(task.title) }}</kbd>
          </v-col>
        </v-row>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: mapState(["activeDoc"]),
  components: {},
  data: () => ({
    step: 1,
  }),
  methods: {
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
