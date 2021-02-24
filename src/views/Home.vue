<template>
  <v-container>
    <v-row>
      <v-col 
        md="7" offset-md="2"
        lg="8" offset-lg="2"
        >
        <v-row>
          <v-col>
            <h1>Welcome to <span class="blue--text darken-2">doc</span><span class="red--text">Re</span><span class="blue--text">place</span></h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Why docReplace</v-card-title>
              <v-card-text>
                <p>I created docReplace because I wanted a structured and dynamic way to document my devops processes.</p>
                <p>Dynamic because I can fill in some variable fields and the document will be updated accordingly.</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            sm="12"
            md="6"
            >
            <v-card>
              <v-card-title>What it isn't</v-card-title>
              <v-card-text>
                <p>docReplace is not a "how to" wiki.</p>
              </v-card-text>
            </v-card>
            <h2></h2>
          </v-col>
          <v-col
            sm="12"
            md="6"
            >
            <v-card>
              <v-card-title>What it is</v-card-title>
              <v-card-text>
                <p>docReplace is a repository of dynamic workflow documents.</p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title>Here's an example</v-card-title>
              <v-card-text>
                <p>Fill in the input fields below and you'll notice the content of <v-chip label x-small color="primary" class="text-uppercase">Input</v-chip> change.</p>
                <p>You can also click on the input text to copy the text to memory.</p>
                <v-row>
                  <v-col v-for="input in activeDoc.inputs" :key="input.name" sm="3">
                    <v-text-field
                  :label="input.label"
                  v-model="input.value"
                  :hint="input.name"
                ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col>
                    <v-card>
                      <div v-for="(task, taskKey) in activeDoc.tasks" :key="taskKey" class="mb-3">
                        <v-card-text>
                          <Tasks :task="task"></Tasks>
                        </v-card-text>
                      </div>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            sm="12"
            md="6"
            >
            <v-card>
              <v-card-title>Who is it for?</v-card-title>
              <v-card-text>
                <p>docReplace is someone who works in IT and runs shell commands or needs to write config files.</p>
              </v-card-text>
            </v-card>
          </v-col>
          <v-col
            sm="12"
            md="6"
            >
            <v-card>
              <v-card-title>Here are more examples</v-card-title>
              <v-card-text>
                <p><router-link :to="{ name: 'ReadDoc', params: { userName: 'preginald', docSlug: 'how-to-start-and-end-an-ssh-session' }}">How to start and end an ssh session</router-link></p>
                <p><router-link :to="{ name: 'ReadDoc', params: { userName: 'preginald', docSlug: 'install-wordpress-on-apache2-virtualhost' }}">Install Wordpress on Apache2 VirtualHost</router-link></p>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import Tasks from "../components/documents/Tasks";

export default {
  props: ['task'],
  name: "Home",
  components: {
    Tasks,
  },
  computed: {
    ...mapState(["activeDoc"]),
  },
  data: () => ({
    doc: {
      variableTag: 'vv',
      inputs: [
        {label:"Username", value: "peter_reginald", name: "username"},
        {label:"IP Address", value: "192.168.38.25", name: "address"},
        {label:"Port", value: "22", name: "port"},
      ],
      tasks: [
        {
          intro: {content: "Type the following to SSH into the host and you should see the output below."},
          input: {content: "ssh -p <vv>port</vv> <vv>username</vv>@<vv>address</vv>"},
          output: {content: "<vv>username</vv>@<vv>address</vv>'s password:"},
          type: "bash",
        },
      ]
    },
  }),
  mounted() {
    this.init()
  },
  methods: {
    ...mapMutations(['setActiveDoc']),
    init(){
      this.setActiveDoc(this.doc)
    },
  } 
};
</script>
