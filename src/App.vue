<!-- DEVNOTE: you MUST declare the tsx extension when using typescript and jsx together so babel can know how to transpile it -->
<script lang="tsx">
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
  render() {
    return (
      <div id="app">
        <header class="main__header">
          <h1>Taskmaster</h1>
        </header>
        <main class="main__body">
          <div class="ui__capture">
            <div class="form__control-group">
              <input
                type="text"
                value={this.newTask}
                onInput={(event: any) => (this.newTask = event.target.value)}
                onKeyup={(event: any) => {
                  event.key === "Enter" ||
                  event.which == 13 ||
                  event.keyCode == 13
                    ? this.addHandler()
                    : null;
                }}
                placeholder="What is your choosen procrastination today?"
                disabled={this.isEdit}
              />
              <button onClick={this.addHandler} disabled={this.isEdit}>
                Add lie
                {/* <Icon icon="plus" /> */}
              </button>
            </div>
          </div>
          <div class="ui__relay">
            <ul
              class={[
                "list__todo",
                "list__unstyled",
                { "list__todo--edit": this.isEdit },
              ]}
            >
              {this.todosList.map((todo: Todo) => (
                <li class="list__todo-item">
                  {!todo.isEdit ? (
                    <div class="ui__todo">
                      <label class="control control__checkbox">
                        <input
                          type="checkbox"
                          checked={!!todo.isComplete}
                          onChange={(event: any) => {
                            this.completeHandler(event, todo);
                          }}
                        />
                        <div class="control__checkbox-handle">
                          {/* <Icon icon="check" /> */}
                        </div>
                        <p>{todo.task}</p>
                      </label>
                      <div class="ui__toolbar">
                        <button
                          onClick={() => this.removeHandler(todo[".key"])}
                        >
                          {/* <Icon icon="trash-alt" title="Remove" /> */}
                        </button>
                        <button onClick={() => this.editHandler(todo[".key"])}>
                          {/* <Icon icon="edit" title="Edit" /> */}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div class="ui__todo ui__todo--edit">
                      <input
                        type="text"
                        value={todo.task}
                        onInput={(event: any) =>
                          (todo.task = event.target.value)
                        }
                        onKeyup={(event: any) => {
                          event.key === "Enter" ||
                          event.which == 13 ||
                          event.keyCode == 13
                            ? this.saveHandler(todo)
                            : null;
                        }}
                      />
                      <div class="ui__toolbar">
                        <button onClick={() => this.saveHandler(todo)}>
                          {/* <Icon icon="save" title="Save" /> */}
                        </button>
                        <button
                          onClick={() => this.cancelHandler(todo[".key"])}
                        >
                          {/* <Icon icon="times-circle" title="Cancel" /> */}
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
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
