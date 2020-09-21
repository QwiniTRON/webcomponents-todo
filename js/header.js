const template = document.createElement('template');
template.innerHTML = `
    <style>
        .nav__item-container, 
        .nav__item-container::after, 
        .nav__item{
            box-sizing: border-box;
        }

        .content{
            background-color: #08f;
            display: flex;
            justify-content: space-between;
            padding: 10px;
            overflow: hidden;
        }

        nav{
            display: flex;
            justify-content: space-between;
            font-family: 'Courier New', Courier, monospace;
            color: white;
            font-weight: 500;
        }

        .nav__item{
            margin: 0 10px;
            border: 3px solid #fff;
            padding: 5px;
            cursor: pointer;
            position: relative;
            z-index: 1;
            background-color: #08f;
            box-shadow: inset 0 0 5px 0 #000;
            text-shadow: 2px 1px 4px #000;
            transition: box-shadow 0.2s;
        }

        .nav__item:hover{
            box-shadow: inset 0 0 0 0 #000;
        }

        .nav__item-container{
            position: relative;
            padding: 0;
        }

        .nav__item-container:first-child{
            margin-right: 10px;
        }

        .nav__item-shadow.one{
            position: absolute;
            top: 0px;
            left: 10px;
            width: 260px;
            height: 266px;
        }

        .nav__item-shadow.two{
            position: absolute;
            top: 0px;
            left: 10px;
            width: 208px;
            height: 208px;
        }
    </style>
    <header class="content">
        <div class="logo"><img src="/src/logo.svg" /></div>
        <nav class="nav">
            <div class="nav__item-container">
                <div class="nav__item" id="aboutAuthor">about author</div>
                <img class="nav__item-shadow one" src="/src/shadow.svg" />
            </div>
            <div class="nav__item-container">
                <div class="nav__item" id="aboutApp">about app</div>
                <svg class="nav__item-shadow two" xmlns="http://www.w3.org/2000/svg" width="208" height="208" viewBox="0 0 208 208">
                    <polygon points="0 0, 103 0, 208 160, 208 208, 160 208, 0 34" />
                </svg>
            </div>
        </nav>
    </header>
`;
export default class Header extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        this._root = this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.shadowRoot?.getElementById('aboutAuthor')?.addEventListener('click', (event) => {
            let html = `
                <my-modal titleModal="QwiniTRON!" textModal="Барабанщиков Иван Николаевич(БИН)."></my-modal>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
        });
        this.shadowRoot?.getElementById('aboutApp')?.addEventListener('click', (event) => {
            let html = `
                <my-modal titleModal="About app." textModal="A small application on web components. It seems nice."></my-modal>
            `;
            document.body.insertAdjacentHTML('beforeend', html);
        });
    }
    disconnectedCallback() { }
}
