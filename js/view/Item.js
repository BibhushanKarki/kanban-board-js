import Dropzone from "./DropZone.js";
import KanbanAPI from "../api/KanbanAPI.js";

export default class Item {
  constructor(id,content){
    const bottomDropZone=Dropzone.createDropZone();
    this.elements={};
    this.elements.root=Item.createRoot();
    this.elements.input=this.elements.root.querySelector('.kanban-item-input');

    this.elements.root.dataset.id=id;
    this.elements.input.textContent=content;
    this.content=content;
    this.elements.root.appendChild(bottomDropZone);

    const onBlur=()=>{
      const newContent=this.elements.input.textContent.trim();

      if(newContent==this.content){
        return;
      }
      this.content=newContent;

      KanbanAPI.updateItems(id,{
        content:this.content
      })
    }

    this.elements.input.addEventListener('blur',onBlur);

    // deleting item
    this.elements.input.addEventListener('dblclick',()=>{
      const check=confirm("Are you sure you want to delete this item?")
      if(check){
        KanbanAPI.deleteItem(id);
        this.elements.input.removeEventListener('blur',onBlur);
        this.elements.root.parentElement.removeChild(this.elements.root);
      }
    });

    // drag and drop api magick !

    this.elements.root.addEventListener("dragstart",e=>{
      e.dataTransfer.setData("text/plain",id);
    });
    this.elements.input.addEventListener("drop",e=>{
      e.preventDefault();
    });
  }

  static createRoot(id,content){
    const range=document.createRange();

    range.selectNode(document.body);

    return range.createContextualFragment(`
    <div class="kanban-item" draggable="true">
      <div class="kanban-item-input" contenteditable></div>
    </div>
    `).children[0];
  }
}