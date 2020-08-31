import { Component, Vue } from "vue-property-decorator";
import { dataTodos } from "./firebase";

import "./app.scss";

import { StyledTitle, StyledSubTitle, StyledCheckbox } from "./app.styled.js"; // typescript will not find definitions because is javascript and will throw an error on inclusion of these vars => "allowJs": true

/*DEVNOTE: You must use the .tsx extension when consuming typescript and jsx together so babel knows*/
interface Todo {
  ".key": string;
  task: string;
  isEdit: boolean;
  isComplete: boolean;
}

// interface StyledTitle = () => void;

@Component({
  components: {
    StyledTitle,
    StyledSubTitle,
    StyledCheckbox,
  },
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
  private addHandler(): void {
    console.log("jb ", this.newTask);
    dataTodos.push({ task: this.newTask, isEdit: false, isComplete: false });
    this.newTask = "";
  }

  //DELETE
  private removeHandler(key: string): void {
    dataTodos.child(key).remove();
  }

  //UPDATE
  private editHandler(key: string): void {
    this.isEdit = true;
    dataTodos.child(key).update({ isEdit: true });
  }

  private saveHandler(todo: Todo): void {
    const key = todo[".key"];
    this.isEdit = false;
    dataTodos
      .child(key)
      .set({ task: todo.task, isEdit: false, isComplete: false });
  }

  private cancelHandler(key: string): void {
    this.isEdit = false;
    dataTodos.child(key).update({ isEdit: false });
  }

  private completeHandler(event: any, todo: Todo): void {
    const key = todo[".key"];
    todo.isComplete = !!event.target.checked; //DEVNOTE: arguably this is unnecessary because of the feedback loop created by the firebase live update but for brevity it is included.
    dataTodos.child(key).update({ isComplete: !!event.target.checked });
  }

  render(h: any): any {
    return (
      <div id="app">
        <header class="main__header">
          <h1>Taskmaster</h1>
          <p>app isEdit {this.isEdit.toString()}</p>
          <StyledTitle>Hello Vue styled component!</StyledTitle>
          <StyledSubTitle>Fantastic</StyledSubTitle>
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
                {/* oddly camel-case will throw a typescript unrecognised error; must be down to the ts declaration file that ships with lib */}
                {/* <fontAwesomeIcon icon="plus" /> */}
                <font-awesome-icon icon="plus" />
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
                      <StyledCheckbox class="control">
                        {/* <label class="control control__checkbox"> */}
                        <input
                          type="checkbox"
                          checked={!!todo.isComplete}
                          onChange={(event: any) => {
                            this.completeHandler(event, todo);
                          }}
                        />
                        <div class="control__checkbox-handle">
                          <font-awesome-icon icon="check" />
                        </div>
                        <p>{todo.task}</p>
                      </StyledCheckbox>
                      <div class="ui__toolbar">
                        <button
                          onClick={() => this.removeHandler(todo[".key"])}
                        >
                          <font-awesome-icon icon="trash-alt" title="Remove" />
                        </button>
                        <button onClick={() => this.editHandler(todo[".key"])}>
                          <font-awesome-icon icon="edit" title="Edit" />
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
                          <font-awesome-icon icon="save" title="Save" />
                        </button>
                        <button
                          onClick={() => this.cancelHandler(todo[".key"])}
                        >
                          <font-awesome-icon
                            icon="times-circle"
                            title="Cancel"
                          />
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
