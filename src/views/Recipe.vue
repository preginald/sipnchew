<template>
  <v-container>
    <div v-if="Object.keys(activeRecipe).length && play">
      <v-row>
        <v-col cols="6">
          <v-btn v-if="stepIndex == 0" block x-large @click="playFinish()">Exit</v-btn>
          <v-btn v-else block x-large @click="playBack()">Back</v-btn>
        </v-col>
        <v-col cols="6">
          <div v-if="'time' in activeStep">
            <v-btn block x-large v-if="activeStep.value == 0" @click="countDown()" color="teal">Start</v-btn>
            <v-btn block x-large v-else @click="restartTimer()" color="orange">Restart</v-btn>
          </div>
          <div v-else>
            <v-btn block x-large v-if="finish" @click="playFinish()">Finish</v-btn>
            <v-btn block x-large @click="playForward()" v-else>Next</v-btn>
          </div>
        </v-col>
      </v-row>
        <v-card :height="windowHeight" class="flexcard mt-3" v-touch="{ left: () => swipe('left'),right: () => swipe('right')}">
          <v-card-title>
          {{ activeStep.title }}
        </v-card-title>
        <v-card-text class="d-flex justify-center mb-6"
          v-if="activeStep.time > 0">
          <v-progress-circular
            :rotate="270"
            :size="300"
            :width="55"
            :value="activeStep.value"
            :color="countDownColor(activeStep.value)"
            @click="countDown()"
            >
            <!-- <span class="text-h5">{{ formattedCountdownValue(activeStep.value) }}</span> -->
            <span class="text-h5">{{ Math.round(activeStep.value) }}%</span>
          </v-progress-circular>
        </v-card-text>
        <v-card-text>
          <v-checkbox
            v-model="task.status" 
            :label="ingredientTitle(task)" 
            v-for="(task, index) in activeStep.tasks" 
            :key="index"
            @change="checkTasks(activeStep.tasks)"
            >
          </v-checkbox>
        </v-card-text>
      </v-card>
    </div>
    <div v-else>
    
      <h2 class="text-h6">
        {{ activeRecipe.name }}
      </h2>
      <v-toolbar dense v-if="userProfile" class="mb-3">
        <v-toolbar-title class="text-capitalize">{{ activeRecipe.status }}</v-toolbar-title>
        <v-btn icon @click="playRecipe()"><v-icon>mdi-play</v-icon></v-btn>

        <v-spacer></v-spacer>
        <template v-if="isOwner && activeRecipe.edit">
          <v-btn icon v-if="activeRecipe.status=='delete'" @click="deleteRecipe(activeRecipe)" class="mx-1" title="Delete forever"><v-icon>mdi-trash-can-outline</v-icon></v-btn>
          <v-btn icon v-else @click="softDeleteRecipe(activeRecipe)" color="blue" class="mx-1" title="Soft delete"><v-icon>mdi-recycle</v-icon></v-btn>
          <v-btn text  @click="updateRecipe(activeRecipe)" color="orange" class="mx-1" title="Update">Update</v-btn>
          <v-btn text  @click="saveRecipe(activeRecipe)" color="green mx-1" title="Save and close">Save</v-btn>
          <v-btn v-if="activeRecipe.status=='draft'"  @click="publish(activeRecipe)" color="green mx-1" title="Save and and publish">Publish</v-btn>
          <v-btn icon @click="toggleEditRecipe()" class="mx-1" title="Close without saving"><v-icon color="red">mdi-pencil-remove</v-icon></v-btn>
        </template>
        <template v-if="activeRecipe.create">
          <v-btn  @click="saveDraft(activeRecipe)" class="mx-1">Save draft</v-btn>
          <v-btn  @click="publish(activeRecipe)" color="green" class="mx-1">Publish</v-btn>
          <v-btn icon @click="toggleCreateRecipe()"><v-icon>mdi-close</v-icon></v-btn>
        </template>
        <template v-if="!activeRecipe.edit">
          <v-btn icon @click="toggleEditRecipe()" v-if="isOwner && this.$route.name == 'ReadRecipe'" class="mx-1" title="Edit"><v-icon>mdi-pencil-outline</v-icon></v-btn>
        </template>
      </v-toolbar>

      <v-card class="mb-3">
        <v-card-actions>
          <v-row>
            <v-col cols="3">
              <v-text-field label="servings" v-model="servings"></v-text-field>
            </v-col>
            <v-col cols="7">
              <v-btn large :disabled="servingsDisabled" @click="servings--">
                 <v-icon>mdi-minus-circle-outline</v-icon>
              </v-btn>
              <v-btn large @click="servings++">
                 <v-icon>mdi-plus-circle-outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
      <v-card class="mb-3">
        <v-card-title>
          Ingredients
        </v-card-title>
        <v-card-text>
          <v-row v-if="activeRecipe.edit">
            <v-col v-for="ingredient in activeRecipe.ingredients" :key="ingredient.name" cols="12" xs="12" sm="6" md="4">
              <v-row>
                <v-col cols="2" xs="2">
                  <v-text-field 
                       label="qty"
                       v-model="ingredient.qty"
                       number
                       ></v-text-field>
                </v-col>
                <v-col cols="2" xs="2">
                  <v-text-field
                  label="unit"
                  v-model="ingredient.unit"
                  ></v-text-field>
                </v-col>
                <v-col cols="8" xs="8">
                  <v-text-field
                    :label="ingredient.name"
                    v-model="ingredient.name"
                    ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" xs="12" sm="6" md="4">
              <v-row>
                <v-col cols="2" xs="2">
                  <v-text-field 
                       label="qty"
                       v-model="ingredient.qty"
                       number
                       ></v-text-field>
                </v-col>
                <v-col cols="2" xs="2">
                  <v-text-field
                  label="unit"
                  v-model="ingredient.unit"
                  ></v-text-field>
                </v-col>
                <v-col cols="8" xs="8">
                  <v-text-field
                    v-on:keyup.enter="addIngredient()"
                    :label="ingredient.name"
                    v-model="ingredient.name"
                    ></v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row v-else>
            <v-col v-for="ingredient in activeRecipe.ingredients" :key="ingredient.name" cols="12" xs="12" sm="6" md="4">
              <v-checkbox v-model="ingredient.status" :label="ingredientLabel(ingredient)"></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-row v-if="activeRecipe.edit">
        <v-col v-for="(step, index) in activeRecipe.steps" :key="index" cols="12" xs="12" sm="12" md="4">
          <v-card>
            <v-card-title>
              <v-text-field
                :label="stepLabel(index)"
                v-model="step.title"
                ></v-text-field>
            </v-card-title>
            <v-card-text v-for="(task, index) in step.tasks" :key="index">
              <v-row>
                <v-col v-if="step.ingredient" cols="3">
                  <v-text-field
                    label="%"
                    v-model="task.percent"
                    number
                    max="100"
                    v-on:keyup="ingredientCalculate(task)"
                    ></v-text-field>
                </v-col>
                <v-col v-if="step.ingredient" cols="9">
                  <v-select
                    :items="ingredientNames"
                    v-model="task.title"
                    :label="ingredientCalculate(task)"
                    ></v-select>
                </v-col>
                <v-col v-else cols="12">
                  <v-text-field
                    :label="taskLabel(index)"
                    v-model="task.title"
                    ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-row>
                <v-col>
                  <v-btn @click="addTask(step)">+</v-btn>
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <v-row v-else>
        <v-col v-for="step in activeRecipe.steps" :key="step.title" cols="12" xs="12" sm="12" md="4">
          <v-card>
            <v-card-title>{{ step.title }}</v-card-title>
            <v-card-text v-for="task in step.tasks" :key="task.title">
              <v-checkbox v-model="task.status" :label="ingredientTitle(task)"></v-checkbox>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>

  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState(["activeRecipe", "userLink","userProfile", "isOwner", "setActiveRecipe"]),
    backBtnClass(){
      return this.stepIndex == 0 ? "disabled" : false
    },
    forwardBtnClass(){
      return this.stepIndex == this.activeRecipe.steps.length - 1? "disabled" : false
    },
    formattedCountdownValue(value){
      return Math.round(value) + "%"
    },
  },
  data: () => ({
    servings: 1,
    servingsDisabled: false,
    settings: [],
    play: false,
    stepIndex: 0,
    finish: false,
    activeStep: {},
    windowHeight: window.innerHeight - 130,
    interval: {},
    ingredient: { qty: "", unit: "", name: "" },
    value: 0,
    ingredientNames: [],
  }),
  methods: {
    ...mapActions(["toggleEditRecipe", "createRecipe", "loadUserRecipe", "updateRecipe", "saveRecipe"]),
    ingredientLabel(ingredient){
      return ingredient.qty * this.servings + " "  + this.getIngredientUnit(ingredient.unit) + " "  + ingredient.name
    },
    ingredientLabelWithQty(ingredient){
      return ingredient.qty * this.servings + " " + this.getIngredientUnit(ingredient.unit) + " "  + ingredient.name
    },
    ingredientCalculate(task){
      const percent = task.percent/100
      const result = this.activeRecipe.ingredients.find(ingredient => ingredient.name == task.title) 
      if(percent){
        return percent * result.qty + " " + this.getIngredientUnit(result.unit)
      }
    },
    getIngredientUnit(unit){
      if(unit == "items"){
        return ""
      } else {
        return unit
      }
    },
    ingredientTitle(task){
      const qty = this.ingredientCalculate(task)
      if(qty){
        return qty + " " + task.title 
      } else {
        return task.title
      }
    },
    getIngredientNames(){
      this.ingredientNames = this.activeRecipe.ingredients.map(a => a.name)
    },
    addIngredient(){
      this.activeRecipe.ingredients.push(this.ingredient)
      this.ingredient = { qty: "", unit: "", name: "" }
    },
    addTask(step){
      if(step.ingredient){
        step.tasks.push({percent: 0, status: false, title: "" })
      }

    },
    stepLabel(index){
      const stepNumber = 1 + index
      return "Step " + stepNumber
    },
    taskLabel(index){
      const taskNumber = 1 + index
      return "Task " + taskNumber
    },
    checkTasks(tasks){
      if(tasks.every(task => task.status == true)){
        this.playForward()
      }
    },
    stepTimer(){
      if('time'in this.activeStep){
        this.activeStep.interval = {}
        this.activeStep.value = 0
        this.activeStep.countDownColor = this.countDownColor(this.activeStep.value)
      }
    },
    restartTimer(){
      this.stepTimer()
      this.clearInterval(this.interval)
    },
    playRecipe(){
      this.finish = false
      //const result = this.activeRecipe.steps.find(step => step.status == false)
      const result = this.activeRecipe.steps[this.stepIndex]
      this.activeStep = result
      this.stepTimer()
      this.play = !this.play
    },
    playForward(){
      if(this.stepIndex < this.activeRecipe.steps.length - 1){
        this.stepIndex ++
        this.activeStep = this.activeRecipe.steps[this.stepIndex]
        this.stepTimer()
      }
      this.finish = this.stepIndex == (this.activeRecipe.steps.length - 1) ? true : false
    },
    playBack(){
      if(this.stepIndex > 0){
        this.stepIndex --
        this.activeStep = this.activeRecipe.steps[this.stepIndex]
        this.stepTimer()
      }
      this.finish = this.stepIndex == (this.activeRecipe.steps.length - 1) ? true : false
    },
    playFinish(){
      this.play = false
      this.stepIndex = 0
      this.loadUserRecipe(this.$route.params)
    },
    swipe(direction){
      switch(direction) {
        case "left":
          this.playForward()
          break
        case "right":
          this.playBack()
          break
      }
    },
    clearInterval(interval){
      return clearInterval(interval)
    },
    countDown(){
      var time = this.activeStep.time
      var increment = 1.666 / (time / 60 )

      this.interval = setInterval(() => {
        if (this.activeStep.value > 99) {
          this.interval = {} 
          increment = 0
          this.interval = this.clearInterval(this.interval)
          this.playForward()
          return (this.activeStep.value = 0)
        }
        this.activeStep.value += increment
      }, 1000)
    },
    countDownColor(value){
      const time = Math.round(value)
      if(time < 75){
        return "teal"
      } else if(time > 75 && time < 95){
        return "yellow"
      } else {
        return "red"
      }
    },
    init(){
      if(this.$route.name === "ReadRecipe"){
        this.loadUserRecipe(this.$route.params)
      }

      if(this.$route.name === "CreateRecipe"){
        let newRecipe = {
          title: '',
          slug: '',
          description: '',
          status: 'edit',
          variableTag: 'vv',
          steps: [{title: 'First step', tasks: [{intro: {content: '', form: true}, input: {content: '', form: true}, output: {content: '', form: true},type: '',form: []}]}],
          inputs: [],
          create: true,
        }
        this.setActiveRecipe(newRecipe)
      }
    },
  },
  mounted() {
    this.init()
  },
  watch: {
    activeRecipe: function (){
      this.getIngredientNames()
    },
      servings: function (){
        if(this.servings < 2){
          this.servingsDisabled = true
        } else {
          this.servingsDisabled = false
        }
      },
  },
}
</script>
