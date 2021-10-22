export default class KanbanAPI {
  static getItems(columnId) {
    const column = read().find(column => column.id == columnId);

    if (!column) {
      return [];
    }
    return column.items;
  }

  static InsertItem(columnID, content) {
    const data = read();
    const column = data.find(column => column.id == columnId);
    const item = {
      id: Math.floor(Math.random() * 100000),
      content
    };

    if (!column) {
      throw new Error('Column does not exist');
    }

    column.items.push(item);
    save(data);

    return item;
  }
  static updateItems(itemId, newProps) {
    const data = read();

    // array destructuring 

    const [item, currentColumn] = (() => {
      for (const column of data) {
        const item = column.items.find(item => item.id == itemId);

        if (item) {
          return [item, column];
        }
      }
    })();

    if (!item) {
      throw new Error("Item not found!");
    }

    item.content = newProps.content === undefined ? item.content : newProps.content;

    // Update column and position 
    if(
      newProps.columnId!==undefined && newProps.position!==undefined
    ){
      const targetColumn=data.find(column=>column.id==newProps.columnId);

      if(!targetColumn){
        throw new Error("Target column not found!");
      }

      // For Deleting the item from it's current column

      currentColumn.items.splice(currentColumn.items.items.indexOf(item),1);

      // For moving item into it's new column and position

      targetColumn.items.splice(newProps.position,0,item);
    }
    save(data);

  }
}

function read() {
  const json = localStorage.getItem('kanban-data');

  if (!json) {
    return [{
        id: 1,
        items: []
      },
      {
        id: 2,
        items: []
      },
      {
        id: 3,
        items: []
      }
    ];
  }

  return JSON.parse(json);
}

// saving to local storage

function save(data) {
  localStorage.setItem('kanban-data', JSON.stringify(data));
}