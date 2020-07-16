<template lang="pug">
  #app
    header.main__header
        h1 Taskmaster
    main.main__body
      .ui__capture
        .form__control-group
          input(type="text"
            v-model="newTask"
            @keyup.enter="addHandler"
            placeholder="What is your choosen procrastination today?"
            :disabled="isEdit"
          )
          button(@click="addHandler" :disabled="isEdit")
            | Add lie
            Icon(icon="plus")

      .ui__relay
        ul.list__todo.list__unstyled(:class="[{'list__todo--edit': isEdit}]")
          li.list__todo-item(v-for="todo in todosList" :key="todo['.key']")
            template(v-if="!todo.isEdit")
              .ui__todo
                label.control.control__checkbox
                  //-
                    input(type="checkbox"
                      v-model="todo.isComplete"
                      @change="completeHandler($event, todo['.key'])"
                    )
                  input(type="checkbox"
                    :checked="!!todo.isComplete"
                    @change="completeHandler($event, todo)"
                  )
                  .control__checkbox-handle
                    Icon(icon="check")
                  p {{ todo.task }}
                .ui__toolbar
                  button.control(@click="removeHandler(todo['.key'])")
                    Icon(icon="trash-alt" title="Remove")
                  button.control(@click="editHandler(todo['.key'])")
                    Icon(icon="edit" title="Edit")


            template(v-else)
              .ui__todo.ui__todo--edit
                input(type="text" v-model="todo.task" @keyup.enter="saveHandler(todo)")
                .ui__toolbar
                  button.control(@click="saveHandler(todo)")
                    Icon(icon="save" title="Save")
                  button.control(@click="cancelHandler(todo['.key'])")
                    Icon(icon="times-circle" title="Cancel")
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { dataTodos } from "./firebase";

interface State {
  newTask: string;
  isEdit: boolean;
}

interface Todo {
  ".key": string;
  task: string;
  isComplete: boolean;
}

/* Vue.extend()
 **********************/
/*
export default Vue.extend({
  name: "app",

  data() {
    return {
      newTask: "",
      todosList: [], // initialise/declare vuefire binding
      isEdit: false
    };
  },

  firebase: {
    // READ
    todosList: dataTodos
  },

  methods: {
    //CREATE
    addHandler() {
      dataTodos.push({ task: this.newTask, isEdit: false, isComplete: false });
      this.newTask = "";
    },

    //DELETE
    removeHandler(key: string) {
      dataTodos.child(key).remove();
    },

    //UPDATE
    editHandler(key: string) {
      this.isEdit = true;
      dataTodos.child(key).update({ isEdit: true });
    },

    saveHandler(todo: Todo) {
      const key = todo[".key"];
      this.isEdit = false;
      dataTodos
        .child(key)
        .set({ task: todo.task, isEdit: false, isComplete: false });
    },

    cancelHandler(key: string) {
      this.isEdit = false;
      dataTodos.child(key).update({ isEdit: false });
    },

    completeHandler(event: any, todo: Todo) {
      const key = todo[".key"];
      todo.isComplete = !!event.target.checked; //DEVNOTE: arguably this is unnecessary because of the feedback loop created by the firebase live update but for brevity it is included.
      dataTodos.child(key).update({ isComplete: !!event.target.checked });
    }
  }
});
*/

/* Class-Style Component
 **********************/
@Component({
  firebase: {
    // READ
    todosList: dataTodos
  }
})
export default class App extends Vue {
  newTask: String = "";
  todosList = []; // initialise/declare vuefire binding
  isEdit: Boolean = false;

  //CREATE
  addHandler() {
    dataTodos.push({ task: this.newTask, isEdit: false, isComplete: false });
    this.newTask = "";
  }

  //DELETE
  removeHandler(key: string) {
    dataTodos.child(key).remove();
  }

  //UPDATE
  editHandler(key: string) {
    this.isEdit = true;
    dataTodos.child(key).update({ isEdit: true });
  }

  saveHandler(todo: Todo) {
    const key = todo[".key"];
    this.isEdit = false;
    dataTodos
      .child(key)
      .set({ task: todo.task, isEdit: false, isComplete: false });
  }

  cancelHandler(key: string) {
    this.isEdit = false;
    dataTodos.child(key).update({ isEdit: false });
  }

  completeHandler(event: any, todo: Todo) {
    const key = todo[".key"];
    todo.isComplete = !!event.target.checked; //DEVNOTE: arguably this is unnecessary because of the feedback loop created by the firebase live update but for brevity it is included.
    dataTodos.child(key).update({ isComplete: !!event.target.checked });
  }
}

/* ES6
 **********************/
/*export default {
  name: "app",

  data() {
    return {
      task: "",
      todosList: [], // initialise/declare vuefire binding
      isEdit: false
    };
  },

  firebase: {
    // READ
    todosList: dataTodos
  },

  methods: {
    //CREATE
    addHandler() {
      dataTodos.push({ task: this.task, isEdit: false, isComplete: false });
      this.task = "";
    },

    //DELETE
    removeHandler(key) {
      dataTodos.child(key).remove();
    },

    //UPDATE
    editHandler(key) {
      this.isEdit = true;
      dataTodos.child(key).update({ isEdit: true });
    },

    saveHandler(todo) {
      const key = todo[".key"];
      this.isEdit = false;
      dataTodos
        .child(key)
        .set({ task: todo.task, isEdit: false, isComplete: false });
    },

    cancelHandler(key) {
      this.isEdit = false;
      dataTodos.child(key).update({ isEdit: false });
    },

    completeHandler(event, todo) {
      const key = todo[".key"];
      todo.isComplete = !!event.target.checked; //DEVNOTE: arguably this is unnecessary because of the feedback loop created by the firebase live update but for brevity it is included.
      dataTodos.child(key).update({ isComplete: !!event.target.checked });
    }
  }
};*/
</script>

<style lang="scss">
html,
body {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1,
h2 {
  font-weight: normal;
}

li {
  margin: 0;
}

a {
  color: #42b983;
}

button {
  font-family: inherit;
  font-size: inherit;
  background-color: black;
  border: 2px solid black;
  color: #fff;
  cursor: pointer;

  &:hover {
    border-color: fuchsia;
    background-color: fuchsia;
  }

  &:focus {
    outline: 0 none;
  }
}

input {
  font-family: inherit;
  font-size: inherit;
  border-radius: 0;
  border: 2px solid black;

  &:focus {
    border-radius: 0;
    outline: none;
    border-color: fuchsia;
  }
}

.list__unstyled {
  list-style-type: none;
  padding: 0;
}

.main__body {
  max-width: 580px;
  margin: 0 auto;
}

.ui__capture {
  .form__control-group {
    display: flex;

    :disabled {
      opacity: 0.25;
    }
  }

  input[type="text"] {
    border-right-width: 0;
    padding: 9px 12px;
    flex: 1;
  }

  button {
    padding: 0 9px;
  }

  svg {
    margin-left: 9px;
  }
}

.ui__relay {
}

.list__todo {
  &--edit {
    .ui__todo {
      opacity: 0.25;
    }

    .ui__todo--edit {
      opacity: 1;
    }
  }
}

.ui__todo {
  display: flex;
  align-items: center;
  margin: 12px 0;

  &:hover {
    p {
      color: fuchsia;
    }

    .control__checkbox .control__checkbox-handle {
      border-color: fuchsia;
    }

    .control__checkbox :checked ~ .control__checkbox-handle {
      background-color: fuchsia;
    }
  }

  input[type="text"] {
    flex: 1;
    border-width: 0;
    border-bottom-width: 2px;
    min-height: 30px;

    &:focus {
      outline: 0 none;
    }
  }

  :checked ~ p {
    text-decoration: line-through;
  }

  .form__control-group {
  }

  $toolbar_gutter: 6px;
  .ui__toolbar {
    display: flex;
    align-items: center;
    margin: {
      left: -$toolbar_gutter;
      right: -$toolbar_gutter;
    }

    button {
      background: transparent;
      color: black;
      border: 0 none;
      display: block;
      height: 34px;

      &:hover {
        color: fuchsia;
      }
    }
  }

  .control {
    margin: 0 $toolbar_gutter;
  }

  .control__checkbox {
    display: flex;
    flex: 1;
    align-items: center;
    cursor: pointer;

    p {
      flex: 1;
      margin: 0;
    }

    input[type="checkbox"] {
      position: absolute;
      z-index: -1;
      visibility: hidden;
    }

    .control__checkbox-handle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border: 2px solid black;
      color: white;

      svg {
        display: none;
      }
    }

    :checked ~ .control__checkbox-handle {
      background-color: black;

      svg {
        display: block;
      }
    }
  }
}
</style>
