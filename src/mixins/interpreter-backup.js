export const taskInterpreter = {
  data: () => ({
    taskContainerClass: "pre",
  }),
  methods: {
    taskInterpreter(task) {
      if (task) {
        const openTag = "<" + this.activeDoc.variableTag + ">";
        const closeTag = "</" + this.activeDoc.variableTag + ">";

        let n = task.search(openTag);
        if (n == -1) {
          return task;
        } else {
          let open = task.split(openTag);
          let n = task.split(closeTag);
          let newTask = "";
          if (open.length == n.length) {
            n.forEach((e) => {
              let x = e.search(openTag);
              if (x == -1) {
                newTask += e;
              } else {
                let variable = this.getVariable(e);
                let value = this.getValue(variable);
                newTask += e.replace(openTag + variable, value);
              }
            });
            return newTask;
          }
        }
      } else {
        return task;
      }
    },
    getVariable(task) {
      const openTag = "<" + this.activeDoc.variableTag + ">";
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
};
