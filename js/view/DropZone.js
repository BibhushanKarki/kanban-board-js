import KanbanAPI from "../api/KanbanAPI.js";

export default class DropZone {
  static createDropZone() {
    const range = document.createRange();

    range.selectNode(document.body);

    const dropZone = range.createContextualFragment(`
    <div class="kanban-dropzone">
    `).children[0];

    // adding active class

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('kanban-dropzone--active');
    });

    // removing active class

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('kanban-dropzone--active');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('kanban-dropzone--active');

      const columnElement = dropZone.closest('.kanban-column');

      const columnId = Number(columnElement.dataset.id);
      const dropZonesInColumn = Array.from(columnElement.querySelectorAll('.kanban-dropzone'));

      // finding where the item is dropped

      const droppedIndex = dropZonesInColumn.indexOf(dropZone);
      const itemId = Number(e.dataTransfer.getData('text/plain'));
      const droppedItemElement = document.querySelector(`[data-id="${itemId}"]`);

      const insertAfter = dropZone.parentElement.classList.contains('kanban-item') ? dropZone.parentElement : dropZone;

      if(droppedItemElement.contains(dropZone)) {
        return;
      }

      insertAfter.after(droppedItemElement);

      KanbanAPI.updateItems(itemId, {
        columnId,
        position: droppedIndex
      });

    });

    return dropZone;
  }
}