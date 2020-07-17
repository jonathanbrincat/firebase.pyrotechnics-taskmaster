<script lang="ts">
/*By far the best migration documentation from the javascript ecosphere to the typescript ecosphere using vue as your mode of transport. well done that man! vue official docs are garbage on this subject.
https://blog.logrocket.com/how-to-write-a-vue-js-app-completely-in-typescript/
*/
import { Component, Vue } from "vue-property-decorator";
import { dataTodos } from "./firebase";

interface Todo {
  ".key": string;
  task: string;
  isEdit: boolean;
  isComplete: boolean;
}

@Component({
  firebase: {
    // READ
    todosList: dataTodos,
  },
})
export default class App extends Vue {
  private newTask: string = "";
  private todosList = []; // initialise/declare vuefire binding
  private isEdit: boolean = false;

  //CREATE
  private addHandler() {
    dataTodos.push({ task: this.newTask, isEdit: false, isComplete: false });
    this.newTask = "";
  }

  //DELETE
  private removeHandler(key: string) {
    dataTodos.child(key).remove();
  }

  //UPDATE
  private editHandler(key: string) {
    this.isEdit = true;
    dataTodos.child(key).update({ isEdit: true });
  }

  private saveHandler(todo: Todo) {
    const key = todo[".key"];
    this.isEdit = false;
    dataTodos
      .child(key)
      .set({ task: todo.task, isEdit: false, isComplete: false });
  }

  private cancelHandler(key: string) {
    this.isEdit = false;
    dataTodos.child(key).update({ isEdit: false });
  }

  private completeHandler(event: any, todo: Todo) {
    const key = todo[".key"];
    todo.isComplete = !!event.target.checked; //DEVNOTE: arguably this is unnecessary because of the feedback loop created by the firebase live update but for brevity it is included.
    dataTodos.child(key).update({ isComplete: !!event.target.checked });
  }

  // Nice guide on render function: https://www.digitalocean.com/community/tutorials/vuejs-introduction-render-functions
  render(h: any) {
    return h(
      "div",
      {
        attrs: {
          id: "app",
        },
      },
      [
        h("header", { class: { "main-header": true } }, [
          h("h1", "Taskmaster"),
        ]),
        h("main", { class: { main__body: true } }, [
          h("div", { class: { ui__capture: true } }, [
            h("div", { class: { "form__control-group": true } }, [
              h("input", {
                attrs: {
                  type: "text",
                  placeholder: "What is your chosen procrastination today?",
                  disabled: this.isEdit,
                },
                domProps: {
                  value: this.newTask,
                },
                on: {
                  input: (event: any) => (this.newTask = event.target.value),
                  keyup: (event: any) =>
                    event.key === "Enter" ||
                    event.which == 13 ||
                    event.keyCode == 13
                      ? this.addHandler()
                      : null,
                },
              }),
              h(
                "button",
                {
                  attrs: {
                    disabled: this.isEdit,
                  },
                  on: {
                    click: this.addHandler,
                  },
                },
                [
                  "Add lie",
                  h("Icon", {
                    props: {
                      icon: "plus",
                    },
                  }),
                ]
              ),
            ]),
          ]),
          h("div", { class: { ui__relay: true } }, [
            h(
              "ul",
              {
                class: {
                  list__unstyled: true,
                  list__todo: true,
                  "list__todo--edit": this.isEdit,
                },
              },
              this.todosList.map((todo: Todo) =>
                h(
                  "li",
                  {
                    class: { "list__todo-item": true },
                    attrs: { key: todo[".key"] },
                  },
                  !todo.isEdit
                    ? [
                        h("div", { class: { ui__todo: true } }, [
                          h(
                            "label",
                            {
                              class: { control: true, control__checkbox: true },
                            },
                            [
                              h("input", {
                                attrs: {
                                  type: "checkbox",
                                },
                                domProps: {
                                  checked: !!todo.isComplete,
                                },
                                on: {
                                  change: (event: any) =>
                                    this.completeHandler(event, todo),
                                },
                              }),
                              h(
                                "div",
                                {
                                  class: { "control__checkbox-handle": true },
                                },
                                [
                                  h("Icon", {
                                    props: {
                                      icon: "check",
                                    },
                                  }),
                                ]
                              ),
                              h("p", [todo.task]),
                            ]
                          ),
                          h("div", { class: { ui__toolbar: true } }, [
                            h(
                              "button",
                              {
                                class: { control: true },
                                on: {
                                  click: () => this.removeHandler(todo[".key"]),
                                },
                              },
                              [
                                h("Icon", {
                                  attrs: {
                                    title: "Remove",
                                  },
                                  props: {
                                    icon: "trash-alt",
                                  },
                                }),
                              ]
                            ),
                            h(
                              "button",
                              {
                                class: { control: true },
                                on: {
                                  click: () => this.editHandler(todo[".key"]),
                                },
                              },
                              [
                                h("Icon", {
                                  attrs: {
                                    title: "Edit",
                                  },
                                  props: {
                                    icon: "edit",
                                  },
                                }),
                              ]
                            ),
                          ]),
                        ]),
                      ]
                    : [
                        h(
                          "div",
                          { class: { ui__todo: true, "ui__todo--edit": true } },
                          [
                            h("input", {
                              attrs: { type: "text" },
                              on: {
                                input: (event: any) =>
                                  (todo.task = event.target.value),
                                keyup: (event: any) =>
                                  event.key === "Enter" ||
                                  event.which == 13 ||
                                  event.keyCode == 13
                                    ? this.saveHandler(todo)
                                    : null,
                              },
                              domProps: {
                                value: todo.task,
                              },
                            }),
                            h("div", { class: { ui__toolbar: true } }, [
                              h(
                                "button",
                                {
                                  class: { control: true },
                                  on: {
                                    click: () => this.saveHandler(todo),
                                  },
                                },
                                [
                                  h("Icon", {
                                    props: { icon: "save", title: "Save" },
                                  }),
                                ]
                              ),
                              h(
                                "button",
                                {
                                  class: { control: true },
                                  on: {
                                    click: () =>
                                      this.cancelHandler(todo[".key"]),
                                  },
                                },
                                [
                                  h("Icon", {
                                    props: {
                                      icon: "times-circle",
                                      title: "Cancel",
                                    },
                                  }),
                                ]
                              ),
                            ]),
                          ]
                        ),
                      ]
                )
              )
            ),
          ]),
        ]),
      ]
    );
  }
}
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
