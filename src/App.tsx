import { Component, Vue } from "vue-property-decorator";
import { dataTodos } from "./firebase";

import "./app.scss";

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
    console.log("jb ", this.newTask);
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

  // DEVNOTE: It seems you can not use typescript, jsx and the render function together in Vue single file components(.vue)! has to be a .tsx extension I guess for babel and the right loaders to transpile
  render(h: any) {
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
                <Icon icon="plus"></Icon>
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
                          <Icon icon="check" />
                        </div>
                        <p>{todo.task}</p>
                      </label>
                      <div class="ui__toolbar">
                        <button
                          onClick={() => this.removeHandler(todo[".key"])}
                        >
                          <Icon icon="trash-alt" title="Remove" />
                        </button>
                        <button onClick={() => this.editHandler(todo[".key"])}>
                          <Icon icon="edit" title="Edit" />
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
                          <Icon icon="save" title="Save" />
                        </button>
                        <button
                          onClick={() => this.cancelHandler(todo[".key"])}
                        >
                          <Icon icon="times-circle" title="Cancel" />
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
