const template = document.createElement('template');
template.innerHTML = `
    <style>
        *{
            box-sizing: border-box;
        }

        input{
            width: 1px;
            height: 1px;
            opacity: 0;
            display: block;
        }

        input:checked ~ span{
            text-decoration: line-through solid black;
        }

        li{
            list-style: none;
            margin: 10px 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 5px 10px;
        }

        span{
            margin-left: 35px;
            display: block;
            font-size: 18px;
            letter-spacing: 2px;
        }

        img{
            width: 40px;
            height: 40px;
            display: block;
        }

        #edit{
            margin-left: auto;
            padding: 5px 15px 5px 5px;
            font-size: 24px;
            background-color: bisque;
            border: 2px solid #999;
            border-radius: 8px 0 0 8px;
            border-right: none;
            margin-right: 2px;
            border-bottom-color: #777;
            box-shadow: 1px 1px 4px 0 #22c;
            transition: box-shadow 0.5s;
            cursor: pointer;
        }

        #edit:active{
            box-shadow: 1px 1px 4px -10px #22c;
        }

        #destroy{
            padding: 5px;
            color: red;
            font-size: 24px;
            background-color: bisque;
            border: 2px solid #999;
            border-color: #999 #777 #777 #999;
            border-radius: 0 8px 8px 0;
            border-left: none;
            box-shadow: -1px 1px 4px 0 #c22;
            transition: box-shadow 0.5s;
            cursor: pointer;
        }

        #destroy:active{
            box-shadow: -1px 1px 4px -10px #c22;
        }

        label{
            display: flex;
            justify-content: flex-start;
            align-items: center;
        }

        [hidden]{
            display: none;
        }

        #editInp{
            flex-grow: 1;
            color: #000;
            font-size: 18px;
            height: auto;
            opacity: 1;
            margin: 0 10px;
            border: none;
            border-bottom: 3px solid #08f;
        }
    </style>
    <li>
        <label>
            <input type="checkbox" id="done">
            <img src="/src/check-false.svg" id="doneImg" />
            <span id="text">...</span>
        </label>
        <input type="text" id="editInp">
        <button type="button" id="edit">• edit</button>
        <button type="button" id="destroy">×</button>
    </li>
`;
export default class MyItem extends HTMLElement {
    constructor() {
        super();
        this.$done = null;
        this.$doneImg = null;
        this.$text = null;
        this.$edit = null;
        this.$destroy = null;
        this.isEdit = false;
        // this._text = <string>this.getAttribute('text')
    }
    connectedCallback() {
        this._checked = this.getAttribute('isDone') === 'true';
        this._text = this.getAttribute('text');
        this._root = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.$done = this._root.getElementById('done');
        this.$doneImg = this._root.getElementById('doneImg');
        this.$text = this._root.getElementById('text');
        this.$edit = this._root.getElementById('edit');
        this.$destroy = this._root.getElementById('destroy');
        this.$editInput = this._root.getElementById('editInp');
        // done change
        this.$done.addEventListener('change', (event) => {
            this._checked = !this._checked;
            this.onClick(event, { detail: this._index, isDone: this._checked });
            this.render();
        });
        // delete
        this.$destroy?.addEventListener('click', (event) => {
            this.onDelete(this._index);
        });
        // edit
        this.$edit?.addEventListener('click', (event) => {
            this.isEdit = !this.isEdit;
            if (!this.isEdit) {
                let value = this.$editInput.value.trim();
                if (value.length > 3) {
                    this._text = value;
                    this.onChangeHandler(this._index, { text: value, isEdit: false });
                }
            }
            else {
                this.onChangeHandler(this._index, { text: '', isEdit: true });
            }
            this.render();
        });
        this.render();
    }
    render() {
        this.$done.checked = this._checked;
        if (this._checked) {
            this.$doneImg.src = '/src/check-true.svg';
        }
        else {
            this.$doneImg.src = '/src/check-false.svg';
        }
        this.$text.textContent = this._text;
        this.$editInput.value = this._text;
        this.$text.hidden = this.isEdit;
        this.$editInput.hidden = !this.isEdit;
    }
    clearEdit() {
        this.isEdit = false;
        this.render();
    }
    disconnectedCallback() { }
}
