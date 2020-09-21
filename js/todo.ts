import MyItem from "./Item"
import MyInput from "./input"

const template = document.createElement('template')
template.innerHTML = `
    <style>
    
    </style>
    <div class="content">
        <my-input id="createInp"></my-input>
        <ul id="list">

        </ul>
    </div>
`

interface ToDo {
    text: string
    isDone: boolean
    isEdit?: boolean
}

export default class MyTodo extends HTMLElement {
    _root: any
    $list: HTMLElement | null = null
    state: ToDo[] = []
    currentEditItemIndex?: number

    constructor() {
        super()
    }

    connectedCallback() {
        // db work
        window.addEventListener('beforeunload', (event) => {
            localStorage.setItem('webtodo', JSON.stringify(this.state))
        })
        let stateFromDB = localStorage.getItem('webtodo')
        
        if(!stateFromDB){
            this.state = []

            setTimeout(() => {
            let html = `
                <my-modal titleModal="Hello!" textModal="TODO APP!"></my-modal>
            `;
            document.body.insertAdjacentHTML('beforeend', html)
            })
        }else{
            this.state = JSON.parse(localStorage.getItem('webtodo') || '[]')
        }
        

        // create layout
        this._root = this.attachShadow({ mode: 'open' })
        this.shadowRoot!.appendChild(template.content.cloneNode(true))

        // clear edit
        document.addEventListener('click', (event) => {
            if((<HTMLElement>event.target).tagName.toLowerCase() !== 'my-todo' && this.currentEditItemIndex! > -1){
                this.clearCurrentEditItem()
                this.currentEditItemIndex = -1
            }
        })

        // add new todo
        this.$list = this.shadowRoot!.getElementById('list');
        (this.shadowRoot!.getElementById('createInp') as MyInput).onCreate = this.addTodo.bind(this)
        this.renderList()
    }

    addTodo(text: string) {
        this.state.push({
            isDone: false,
            text
        })

        this.renderList()
    }

    renderList() {
        // my-item
        this.$list!.innerHTML = ''
        this.state.forEach((todo, i) => {
            let item: MyItem = document.createElement('my-item') as MyItem

            item.setAttribute('isDone', todo.isDone.toString())
            item.setAttribute('text', todo.text)
            item._index = i
            item.onClick = (event, detail) => {
                this.changeDone(detail.detail, detail.isDone)
            }
            item.onDelete = this.deleteTodo.bind(this)
            item.onChangeHandler = this.changeTextHandler.bind(this)

            this.$list!.append(item)
        })

        if (this.state.length === 0) {
            this.$list!.innerHTML = '<p> Задач пока нет... </p>'
        }
    }

    changeDone(i: number, done: boolean) {
        this.state[i].isDone = done
    }

    deleteTodo(i: number) {
        this.state.splice(i, 1)
        this.renderList()
    }

    clearCurrentEditItem() {
        let elem: MyItem = this.$list!.children[this.currentEditItemIndex!] as MyItem
        elem.clearEdit()
    }

    changeTextHandler(i: number, detail: { text: string, isEdit: boolean }) {
        if (!detail.isEdit) {
            this.changeText(i, { text: detail.text })
            this.currentEditItemIndex = -1
        } else {
            if (this.currentEditItemIndex! > -1) {
                this.clearCurrentEditItem()
            }
            this.currentEditItemIndex = i
        }
    }

    changeText(i: number, detail: { text: string }) {
        this.state[i].text = detail.text
    }

    disconnectedCallback() { }
}