export const taskInterpreter = {
  data: () => ({
    taskContainerClass: "pre",
    optionHyphen: false,
  }),
  methods: {
    taskInterpreter(task) {
      let newTask = this.processVariables(task);
      newTask = this.processOptions(newTask);
      newTask = this.processHyphen(newTask);
      return newTask;
    },
    commandInterpreter(task) {
      let newTask = this.processCommandVariables(task);
      newTask = this.processCommandOptions(newTask);
      if (!this.activeCommand.create) {
        newTask = this.processHyphen(newTask);
      }
      return newTask;
    },
    processHyphen(task) {
      if (task.includes("<hyphen>")) {
        if (this.optionHyphen == false) {
          task = task.replace("<hyphen>", "");
        } else {
          task = task.replace("<hyphen>", " -");
        }
      }
      return task;
    },
    optionChecker() {
      let result = this.activeDoc.options.every((e) => e.state == false);
      if (result) {
        this.optionHyphen = false;
      }
    },
    processVariables(task) {
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
                let value = this.getVariableValue(variable);
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
    processCommandVariables(task) {
      if (task) {
        const openTag = "<" + this.activeCommand.variableTag + ">";
        const closeTag = "</" + this.activeCommand.variableTag + ">";

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
                let variable = this.getCommandVariable(e);
                let value = this.getCommandVariableValue(variable);
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
    processOptions(task) {
      if (task) {
        const openTag = "<" + this.activeDoc.optionTag + ">";
        const closeTag = "</" + this.activeDoc.optionTag + ">";

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
                let option = this.getOption(e);
                let value = this.getOptionValue(option);
                newTask += e.replace(openTag + option, value);
              }
            });
            return newTask;
          }
        }
      } else {
        return task;
      }
    },
    processCommandOptions(task) {
      if (task) {
        const openTag = "<" + this.activeCommand.optionTag + ">";
        const closeTag = "</" + this.activeCommand.optionTag + ">";

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
                let option = this.getCommandOption(e);
                let value = this.getCommandOptionValue(option);
                newTask += e.replace(openTag + option, value);
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
    getCommandVariable(task) {
      const openTag = "<" + this.activeCommand.variableTag + ">";
      let n = task.search(openTag);

      if (n > -1) {
        let variable = task.substring(n + openTag.length, task.length);
        return variable;
      }
    },
    getOption(task) {
      const openTag = "<" + this.activeDoc.optionTag + ">";
      let n = task.search(openTag);

      if (n > -1) {
        let variable = task.substring(n + openTag.length, task.length);
        return variable;
      }
    },
    getCommandOption(task) {
      const openTag = "<" + this.activeCommand.optionTag + ">";
      let n = task.search(openTag);

      if (n > -1) {
        let variable = task.substring(n + openTag.length, task.length);
        return variable;
      }
    },
    getVariableValue(name) {
      let n = this.activeDoc.inputs.find((e) => e.name == name);
      return n.value;
    },
    getCommandVariableValue(name) {
      let n = this.activeCommand.inputs.find((e) => e.name == name);
      return n.value;
    },
    getOptionValue(name) {
      let n = this.activeDoc.options.find((e) => e.name == name);
      let value = n.state ? n.value : "";
      if (value && this.optionHyphen == false) {
        this.optionHyphen = true;
      }
      return value;
    },
    getCommandOptionValue(name) {
      let n = this.activeCommand.options.find((e) => e.name == name);
      let value = n.state ? n.value : "";
      if (value && this.optionHyphen == false) {
        this.optionHyphen = true;
      }
      return value;
    },
  },
};
