const template = document.createElement('template');
template.innerHTML = `
    <style>
    
    </style>
    <div class="content">
        <my-input id="createInp"></my-input>
        <ul id="list">

        </ul>
    </div>
`;
export default class MyTodo extends HTMLElement {
    constructor() {
        super();
        this.$list = null;
        this.state = [];
    }
    connectedCallback() {
        // db work
        window.addEventListener('beforeunload', (event) => {
            localStorage.setItem('webtodo', JSON.stringify(this.state));
        });
        let stateFromDB = localStorage.getItem('webtodo');
        if (!stateFromDB) {
            this.state = [];
            setTimeout(() => {
                let html = `
                <my-modal titleModal="Hello!" textModal="TODO APP!"></my-modal>
            `;
                document.body.insertAdjacentHTML('beforeend', html);
            });
        }
        else {
            this.state = JSON.parse(localStorage.getItem('webtodo') || '[]');
        }
        // create layout
        this._root = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        // clear edit
        document.addEventListener('click', (event) => {
            if (event.target.tagName.toLowerCase() !== 'my-todo' && this.currentEditItemIndex > -1) {
                this.clearCurrentEditItem();
                this.currentEditItemIndex = -1;
            }
        });
        // add new todo
        this.$list = this.shadowRoot.getElementById('list');
        this.shadowRoot.getElementById('createInp').onCreate = this.addTodo.bind(this);
        this.renderList();
    }
    addTodo(text) {
        this.state.push({
            isDone: false,
            text
        });
        this.renderList();
    }
    renderList() {
        // my-item
        this.$list.innerHTML = '';
        this.state.forEach((todo, i) => {
            let item = document.createElement('my-item');
            item.setAttribute('isDone', todo.isDone.toString());
            item.setAttribute('text', todo.text);
            item._index = i;
            item.onClick = (event, detail) => {
                this.changeDone(detail.detail, detail.isDone);
            };
            item.onDelete = this.deleteTodo.bind(this);
            item.onChangeHandler = this.changeTextHandler.bind(this);
            this.$list.append(item);
        });
        if (this.state.length === 0) {
            this.$list.innerHTML = '<p> Задач пока нет... </p>';
        }
    }
    changeDone(i, done) {
        this.state[i].isDone = done;
    }
    deleteTodo(i) {
        this.state.splice(i, 1);
        this.renderList();
    }
    clearCurrentEditItem() {
        let elem = this.$list.children[this.currentEditItemIndex];
        elem.clearEdit();
    }
    changeTextHandler(i, detail) {
        if (!detail.isEdit) {
            this.changeText(i, { text: detail.text });
            this.currentEditItemIndex = -1;
        }
        else {
            if (this.currentEditItemIndex > -1) {
                this.clearCurrentEditItem();
            }
            this.currentEditItemIndex = i;
        }
    }
    changeText(i, detail) {
        this.state[i].text = detail.text;
    }
    disconnectedCallback() { }
}
