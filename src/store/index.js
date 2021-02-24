import Vue from "vue";
import Vuex from "vuex";
import * as fb from "../firebase";
import router from "../router/index";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    userProfile: {},
    userRecipes: null,
    activeRecipe: {},
    nav: false,
    isOwner: true,
    userLink: "",
    snackbar: { status: false, text: "", timeout: 2000 },
    recipeValidation: {
      slug: "",
    },
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setUserProfile(state, user) {
      state.userProfile = user;
    },
    setUidToUserProfile(state, uid) {
      state.userProfile.uid = uid;
    },
    setUserDocs(state, docs) {
      state.userDocs = docs;
    },
    setDocSlugs(state, docSlugs) {
      state.docSlugs = docSlugs;
    },
    setActiveRecipe(state, recipe) {
      state.activeRecipe = recipe;
    },
    setCommands(state, commands) {
      state.commands = commands;
    },
    setActiveCommand(state, command) {
      state.activeCommand = command;
    },
    setNav(state, status) {
      state.nav = status;
    },
    setSnackbar(state, snackbar) {
      state.snackbar.status = snackbar.status;
      state.snackbar.text = snackbar.text;
    },
    setIsOwner(state, val) {
      state.isOwner = val;
    },
    setUserLink(state, val) {
      state.userLink = val;
    },
    setEditDoc(state, status) {
      state.activeDoc.edit = status;
    },
    setCreateDoc(state, status) {
      state.activeDoc.create = status;
    },
    setValidRecipeSlug(state, status) {
      state.recipeValidation.slug = status;
    },
  },
  actions: {
    async signup({ dispatch }, form) {
      // sign user up
      const { user } = await fb.auth.createUserWithEmailAndPassword(
        form.email,
        form.password
      );

      // create user profile object in userCollection
      await fb.usersCollection.doc(user.uid).set({
        username: form.username,
      });

      // fetch user profile and set in state
      dispatch("fetchUserProfile", user);
    },
    async login({ dispatch }, form) {
      // sign user in
      const { user } = await fb.auth.signInWithEmailAndPassword(
        form.email,
        form.password
      );

      // fetch user profile and set in state
      dispatch("fetchUserProfile", user);
    },
    async logout({ commit }) {
      await fb.auth.signOut();

      // clear userProfile and redirect to /login
      commit("setUserProfile", null);
      commit("setNav", false);
      router.push("/login");
    },
    async fetchUserProfile({ commit, dispatch }, user) {
      // fetch user profile
      const userProfile = await fb.usersCollection.doc(user.uid).get();

      // set user profile in state
      commit("setUserProfile", userProfile.data());

      // set uid to user profile in state
      commit("setUidToUserProfile", user.uid);

      // set user nav in state
      commit("setNav", true);

      dispatch("constructUserLink", userProfile.data().username);

      // change route to dashboard
      if (router.currentRoute.path === "/login") {
        router.push({
          name: "UserHome",
          params: { userName: userProfile.data().username },
        });
      }
    },
    async fetchUserRecipes({ commit, dispatch }, params) {
      var currentUser = fb.auth.currentUser;
      // fetch user docs
      await fb.docsCollection
        .where("username", "==", params.userName)
        .get()
        .then((querySnapshot) => {
          let data = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          const docSlugs = data.map((doc) => ({
            id: doc.id,
            slug: doc.slug,
          }));

          dispatch("constructUserLink", params.userName);

          commit("setDocSlugs", docSlugs);

          if (currentUser == null) {
            data = data.filter((doc) => doc.status == "publish");
          } else if (currentUser && data[0].uid !== currentUser.uid) {
            data = data.filter((doc) => doc.status == "publish");
          }

          // set active doc in state
          commit("setUserDocs", data);
        });
    },
    async fetchActiveRecipe({ state, commit, dispatch }, params) {
      if (typeof state.activeRecipe.length == "undefined") {
        // fetch active doc
        await fb.recipesCollection
          .where("username", "==", params.userName)
          .where("slug", "==", params.recipeSlug)
          .get()
          .then((querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            // dispatch("processor", data[0]);
            // set active doc in state
            commit("setActiveRecipe", data[0]);
          });
      }
      dispatch("constructUserLink", params.userName);
      dispatch("isOwner");
    },
    loadUserRecipe({ commit, dispatch }, recipe) {
      commit("setValidRecipeSlug", false);
      if ("uid" in recipe) {
        commit("setActiveRecipe", recipe);
        router.push({
          name: "ReadRecipe",
          params: { userName: recipe.username, recipeSlug: recipe.slug },
        });
      } else {
        dispatch("fetchActiveRecipe", recipe);
      }
    },
    loadCommand({ commit }, command) {
      commit("setActiveCommand", command);
      router.push({
        name: "ReadCommand",
        params: { commandSlug: command.slug },
      });
    },
    async isOwner({ commit, state }) {
      var currentUser = fb.auth.currentUser;
      if (currentUser) {
        var uid = currentUser.uid;
        if (uid) {
          commit("setIsOwner", uid == state.activeRecipe.uid);
        }
      } else {
        commit("setIsOwner", false);
      }
    },
    toggleCreateDoc({ state, commit }) {
      commit("setCreateDoc", !state.activeDoc.create);
      if (!state.activeDoc.create) {
        router.push({
          name: "UserHome",
          params: { userName: state.userProfile.username },
        });
      }
    },
    async toggleEditRecipe({ state, commit }) {
      let recipe = state.activeRecipe;
      recipe.edit = !recipe.edit;
      await fb.recipesCollection
        .doc(recipe.id)
        .update({
          edit: recipe.edit,
        })
        .then(() => {
          console.log("Recipe successfully updated!");
        })
        .catch((error) => {
          console.log("Error updating recipe: ", error);
        });
      commit("setActiveRecipe", recipe);
    },
    async toggleEditCommand({ state, commit }) {
      let command = state.activeCommand;
      command.edit = !command.edit;
      await fb.commandsCollection
        .doc(command.id)
        .update({
          edit: command.edit,
        })
        .then(() => {
          console.log("Command successfully updated!");
        })
        .catch((error) => {
          console.log("Error updating command: ", error);
        });
      commit("setActiveCommand", command);
    },
    constructUserLink({ state, commit }, username) {
      if ("username" in state.activeRecipe) {
        username = state.activeRecipe.username;
      } else if ("username" in state.userProfile) {
        username = state.userProfile.username;
      }
      commit("setUserLink", "/" + username);
    },
    async createRecipe({ state, commit }, recipe) {
      recipe.username = state.userProfile.username;
      recipe.uid = state.userProfile.uid;
      const editStatus = recipe.status == "draft" ? true : false;
      console.log(editStatus);
      console.log(recipe.username);

      await fb.recipesCollection
        .add(recipe)
        .then((recipeRef) => {
          console.log("Saved recipe: ", recipeRef.id);
          recipe.id = recipeRef.id;
          // commit("setActiveRecipe", recipe);
          // commit("setEditRecipe", editStatus);
          commit("setSnackbar", {
            status: true,
            text: "Recipe successfully created",
          });
          router.push({
            name: "ReadRecipe",
            params: { userName: recipe.username, recipeSlug: recipe.slug },
          });
        })
        .catch((error) => {
          console.log("Error adding recipe: ", error);
          commit("setSnackbar", {
            status: true,
            text: "Error creating recipe!",
          });
        });
    },
    async deleteDoc({ commit }, doc) {
      await fb.docsCollection
        .doc(doc.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          commit("setSnackbar", {
            status: true,
            text: "Doc successfully deleted forever!",
          });
          router.push({ name: "UserHome", params: { userName: doc.username } });
          commit("setActiveDoc", {});
        })
        .catch((error) => {
          console.log("Error removing document: ", error);
          commit("setSnackbar", { status: true, text: "Error deleting doc!" });
        });
    },
    async softDeleteDoc({ commit }, doc) {
      await fb.docsCollection
        .doc(doc.id)
        .update({
          status: "delete",
        })
        .then(() => {
          console.log("Document successfully updated!");
          commit("setSnackbar", {
            status: true,
            text: "Doc successfully soft deleted!",
          });
          doc.status = "delete";
        })
        .catch((error) => {
          console.log("Error updating document: ", error);
          commit("setSnackbar", {
            status: true,
            text: "Error soft deleting doc!",
          });
        });
      commit("setActiveDoc", doc);
    },
    async saveRecipe({ commit }, recipe) {
      recipe.edit = false;
      await fb.recipesCollection
        .doc(recipe.id)
        .update(recipe)
        .then(() => {
          console.log("Recipe successfully updated!");
          commit("setSnackbar", {
            status: true,
            text: "Recipe successfully saved!",
          });
        })
        .catch((error) => {
          console.log("Error updating recipe: ", error);
          commit("setSnackbar", { status: true, text: "Error saving recipe!" });
        });
      commit("setActiveRecipe", recipe);
    },
    async updateRecipe({ commit }, recipe) {
      await fb.recipesCollection
        .doc(recipe.id)
        .update(recipe)
        .then(() => {
          console.log("Recipe successfully updated!");
          commit("setSnackbar", {
            status: true,
            text: "Recipe successfully updated!",
          });
        })
        .catch((error) => {
          console.log("Error updating recipe: ", error);
          commit("setSnackbar", {
            status: true,
            text: "Error updating recipe!",
          });
        });
      commit("setActiveRecipe", recipe);
    },
    async updateSteps({ state }) {
      await fb.docsCollection.doc(state.activeDoc.id).update({
        steps: state.activeDoc.steps,
      });
    },
    async createCommand({ state, commit }, command) {
      command.create = false;
      command.username = state.userProfile.username;
      command.uid = state.userProfile.uid;

      await fb.commandsCollection
        .add(command)
        .then((docRef) => {
          console.log("Saved command: ", docRef.id);
          command.id = docRef.id;
          commit("setActiveCommand", command);
          // commit("setEditDoc", editStatus);
          commit("setSnackbar", {
            status: true,
            text: "Command successfully created",
          });
          router.push({
            name: "ReadCommand",
            params: { commandSlug: command.slug },
          });
        })
        .catch((error) => {
          console.log("Error adding command: ", error);
          commit("setSnackbar", {
            status: true,
            text: "Error creating command!",
          });
        });
    },
    async saveCommand({ commit }, command) {
      command.edit = false;
      await fb.commandsCollection
        .doc(command.id)
        .update(command)
        .then(() => {
          console.log("Command successfully updated!");
          commit("setSnackbar", {
            status: true,
            text: "Command successfully saved!",
          });
        })
        .catch((error) => {
          console.log("Error updating command: ", error);
          commit("setSnackbar", {
            status: true,
            text: "Error saving command!",
          });
        });
      commit("setActiveCommand", command);
    },
    async updateCommand({ commit }, command) {
      await fb.commandsCollection
        .doc(command.id)
        .update(command)
        .then(() => {
          console.log("Command successfully updated!");
          commit("setSnackbar", {
            status: true,
            text: "Command successfully updated!",
          });
        })
        .catch((error) => {
          console.log("Error updating command: ", error);
          commit("setSnackbar", {
            status: true,
            text: "Error updating command!",
          });
        });
      commit("setActiveCommand", command);
    },
    async fetchCommands({ state, commit }) {
      if (typeof state.activeCommand.length == "undefined") {
        // fetch active command
        await fb.commandsCollection.get().then((querySnapshot) => {
          let data = querySnapshot.docs.map((command) => ({
            id: command.id,
            ...command.data(),
          }));

          // dispatch("processor", data[0]);
          // set active doc in state
          // commit('setActiveDoc',data[0])
          commit("setCommands", data);
        });
      }
    },
    async fetchCommand({ state, commit }, params) {
      if (typeof state.activeCommand.length == "undefined") {
        // fetch active command
        await fb.commandsCollection
          .where("slug", "==", params.commandSlug)
          .get()
          .then((querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            // dispatch("processor", data[0]);
            // set active doc in state
            // commit('setActiveDoc',data[0])
            commit("setActiveCommand", data[0]);
          });
      }
    },
    async slugCheck({ state, commit }) {
      if (state.docSlugs) {
        let result = state.docSlugs.some((doc) => {
          // console.log(payload.slug)
          return (
            doc.slug === state.activeDoc.slug && doc.id != state.activeDoc.id
          );
        });
        commit("setValidDocSlug", result);
      } else {
        commit("setValidDocSlug", true);
      }
    },
  },
  modules: {},
});
