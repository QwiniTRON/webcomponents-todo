const template = document.createElement('template');
template.innerHTML = `
    <style>
        *{
            box-sizing: border-box;
        }

        input{
            width: 99%;
            margin: 5px;
            display: block;
            border: 3px solid #08f;
            font-size: 18px;
            padding: 3px 2px;
            transition: border-color 0.3s, padding 0.2s;
        }

        input:focus{
            padding-left: 6px;
        }
    </style>
    <form id="form"><input placeholder="your todo" id="inp" type="text"></form>
`;
export default class MyInput extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this._root = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.$form = this.shadowRoot.getElementById('form');
        this.$input = this.shadowRoot.getElementById('inp');
        this.$form.addEventListener('submit', (event) => {
            event.preventDefault();
            let value = this.$input.value.trim();
            if (value.length > 3) {
                this.onCreate(this.$input.value);
                this.$input.value = '';
                this.$input?.style.setProperty('border-bottom-color', '');
            }
            else {
                this.$input?.style.setProperty('border-bottom-color', '#f80');
            }
        });
    }
    disconnectedCallback() { }
}
