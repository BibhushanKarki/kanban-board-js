import Dropzone from "./DropZone.js";
import KanbanAPI from "../api/KanbanAPI.js";
import Item from "./Item.js";

export default class Column{
  constructor(id,title){
    const topDropZone=Dropzone.createDropZone();
    this.elements={};
    this.elements.root=Column.createRoot();
    this.elements.title=this.elements.root.querySelector('.kanban-column-title');
    this.elements.items=this.elements.root.querySelector('.kanban-column-items');
    this.elements.addItem=this.elements.root.querySelector('.kanban-add-item');

    this.elements.root.dataset.id=id;
    this.elements.title.textContent=title;
    this.elements.items.appendChild(topDropZone);

    this.elements.addItem.addEventListener('click',()=>{
      // todo: add item

      const newItem=KanbanAPI.InsertItem(id,"");
      this.renderItem(newItem);

    });

    KanbanAPI.getItems(id).forEach(item => {
      this.renderItem(item);
    });
  }

  static createRoot(){
    const range=document.createRange();

    range.selectNode(document.body);

    return range.createContextualFragment(`
    <div class="kanban-column">
      <div class="kanban-column-title">
      </div>
      <div class="kanban-column-items">
        <div class="kanban-dropzone">
        </div>
      </div>
      <button class="kanban-add-item" type="button">+ Add</button>
    </div>
    `).children[0];
  }

  renderItem(data){
    // todo:create item instance
    const item=new Item(data.id,data.content);
    this.elements.items.appendChild(item.elements.root);
  }
}