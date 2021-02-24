<template>
    <v-row class="mt-2">
      <v-col sm="12">
        <div>
          <p>{{ task.intro.content }}</p>
          <v-row v-if="task.input.content" justify="space-between" class="mt-2">
            <v-col class="mb-1"><v-chip label x-small color="primary" class="text-uppercase">Input</v-chip></v-col>
            <v-col v-if="task.type != 'none'" class="text-right"><v-chip label x-small color="black" text-color="white" class="text-uppercase">{{task.type}}</v-chip></v-col>
          </v-row>
          <v-sheet v-if="task.input.content" v-clipboard:copy="taskInterpreter(task.input.content)" v-clipboard:success="onCopy" v-clipboard:error="onError" elevation="1" :class="taskContainerClass"><span :class="task.type">{{ taskInterpreter(task.input.content) }}</span></v-sheet>
          <v-row v-if="task.output.content" justify="space-between" class="mt-2">
            <v-col class="mb-1"><v-chip label x-small color="success" class="text-uppercase">Output</v-chip></v-col>
          </v-row>
          <v-sheet v-if="task.output.content" elevation="1" :class="taskContainerClass"><span :class="task.type">{{ taskInterpreter(task.output.content) }}</span></v-sheet>
        </div>
      </v-col>
    </v-row>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { taskInterpreter } from "../../mixins/interpreter.js"

export default {
  mixins: [taskInterpreter],
  props: ['task'],
  computed: {
    ...mapState(["activeDoc", "taskTypes"]),
  },
  name: "Tasks",
  methods: {
    ...mapMutations(['setSnackbar']),
    onCopy(task){ 
      const length = 30
      const text = task.text.length > length ? task.text.substring(0,length) + "..." : task.text
      let snackbar = {}
      snackbar.text = "Copied " + text 
      snackbar.status = true
      this.setSnackbar(snackbar)
      // console.log(e)
    },
    onError() {
      console.log('Error copy')
    },
    rows(task){
      return task.split(/\r\n|\r|\n/).length
    },
    setTaskType(task,type){
      task.type = type
    },
  },
  data: () => ({
    // step: 1,
  }),
};
</script>

<style scoped>

.pre {
  display: block;
  white-space: pre;
  font-family: "Roberto Mono", Monaco, courier, monospace;
  padding: 1.2em 1.4em;
  font-size: 0.85rem;
  position: relative;
  overflow-y: hidden;
}

.bash::before {
  content: "$";
}

.mysql::before {
  content: "mysql>";
}

.pre ::before {
  position: relative;
  left: 0;
  padding: 10px;
}

</style>
