const template = `
    <style>
        *{
            box-sizing: border-box;
        }

        .modal{
            position: fixed;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: 5;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: modalenter 4s forwards;
        }

        .modal__body{
            padding: 10px;
            display: inline-block;
            min-width: 400px;
            position: relative;
            animation: bodyenter 2s forwards;
        }

        .modal__close{
            color: red;
            position: absolute;
            top: -30px;
            right: -25px;
            font-size: 30px;
            cursor: pointer;
        }

        .modal__content-title{
            
        }

        .modal__content-text{

        }


        @keyframes bodyenter{
            from{
                background-color: rgba(255, 255, 255, 0.8);
            }
            to{
                background-color: rgba(255, 255, 255, 1);
            }
        }

        @keyframes modalenter{
            from{
                background-color: rgba(0, 0, 0, 1);
            }
            to{
                background-color: rgba(0, 0, 0, 0.5);
            }
        }
    </style>
    <div class="modal">
        <div class="modal__body">
            <div class="modal__content">
                <div class="modal__close">×</div>
                <h3 class="modal__content-title" id="title">{{title}}</h3>
                <p id="text" class="modal__content-text">{{text}}</p>
            </div>
        </div>
    </div>
`
// Можно использовать str.replace() и вставлять контент
export default class MyItem extends HTMLElement {
    _root: any
    modalText?: string
    modalTitle?: string

    constructor() {
        super()
    }

    connectedCallback() {
        let HTML = template

        this._root = this.attachShadow({ mode: 'open' })
        this.modalText = this.getAttribute('textModal') as string
        this.modalTitle = this.getAttribute('titleModal') as string

        HTML = HTML.replace('{{title}}', this.modalTitle)
        HTML = HTML.replace('{{text}}', this.modalText)

        this.shadowRoot!.innerHTML = HTML
        
        this.shadowRoot!.children[1].addEventListener('click', (event) => {
            if ((<HTMLElement>event.target).classList.contains('modal') ||
                (<HTMLElement>event.target).classList.contains('modal__close')) 
            {
                this.remove()
            }
        })
    }

    disconnectedCallback() { }
}