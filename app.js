// Storage Controller
const StorageCtrl = (() => {
    return {
        // Publich methods
        storeItem: function (item) {
            let items;
            // Check if any items in localStorage
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            items.push(item);
            localStorage.setItem('items', JSON.stringify(items));
        },
        getItemsFromStorage: function () {
            let items;
            if (localStorage.getItem('items') === null) {
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'))
            }

            return items;
        },
        updateItemStorage: function (updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function (item, index) {
                if (updatedItem.id === item.id) {
                    // Delete current item and replace with updated item
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteItemFromStorage: function (id) {
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function (item, index) {
                if (id === item.id) {
                    // Delete current item
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }
    }
})();


// Item Controller
const ItemCtrl = (() => {
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    // Data Structure/ State
    const data = {
        //items: [
        // { id: 0, name: 'Steak Dinner', calories: 1200 },
        // { id: 1, name: 'Cookie', calories: 400 },
        // { id: 2, name: 'Eggs', calories: 300 }
        //],
        items: StorageCtrl.getItemsFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    // for public invoke
    return {
        getItems: function () {
            return data.items;
        },
        getItemById: function (id) {
            let found = null;
            data.items.forEach(function (item) {
                if (item.id === id) {
                    found = item;
                }
            })

            return found;
        },
        getCurrentItem: function () {
            return data.currentItem
        },
        setCurrentItem: function (item) {
            data.currentItem = item;
        },
        addItem: function (name, calories) {
            //Create ID
            if (data.items.length > 0) {
                id = data.items[data.items.length - 1].id + 1
            } else {
                id = 0;
            }

            //Calories to number
            calories = parseInt(calories);

            //Create new item
            newItem = new Item(id, name, calories);
            data.items.push(newItem);

            return newItem;
        },
        updateItem: function (name, calories) {
            // Calories to a number because it's going from form
            calories = parseInt(calories);
            let found = null;

            data.items.forEach(function (item) {
                if (item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });

            return found;
        },
        deleteItem: function (id) {
            //Get ids
            ids = data.items.map(function (item) {
                return item.id;
            });
            // Get index
            const index = ids.indexOf(id);
            //Remove item
            data.items.splice(index, 1);

        },
        clearAllItems: function () {
            data.items = [];
        },
        logData: function () {
            return data;
        },
        getTotalCalories: function () {
            let total = 0;
            data.items.forEach(function (item) {
                total += item.calories;
            });

            data.totalCalories = total;
            return data.totalCalories;
        }
    }

})();

// UI 
const UICtrl = (() => {

    const UISelectors = {
        //buttons
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',


        //
        itemList: '#item-list',
        listItems: '#item-list li',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories',
    }

    return {
        populateItemList: function (items) {
            let html = '';
            items.forEach(function (item) {
                html += `
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}:
                        <em>${item.calories} Calories</em>
                    </strong>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>`;
            });

            // Insert list items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },

        getItemInput: function () {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        getSelectors: function () {
            return UISelectors;
        },
        addListItem: function (item) {
            // Show the list
            document.querySelector(UISelectors.itemList).style.display = 'block';

            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `
            <strong>${item.name}: <em>${item.calories} Calories</em>
            </strong>
            <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
            </a>
            `;

            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li)
        },
        updateListItem: function (item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list in to array
            listItems = Array.from(listItems);
            listItems.forEach(function (listItem) {
                const itemId = listItem.getAttribute('id');

                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `
                    <strong>${item.name}: <em>${item.calories} Calories</em>
                    </strong>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>
                    
                    `;
                }
            });

        },
        deleteListItem: function (id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        removeItems: function () {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            //Turn Node list into array
            listItems = Array.from(listItems);
            listItems.forEach(function (item) {
                item.remove();
            })
        },
        // When 0 items in item list it still the line on UI
        hideList: function () {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        clearInput: function () {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        showTotalCalories: function (total) {
            document.querySelector(UISelectors.totalCalories).textContent = total;
        },
        clearEditState: function () {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function () {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        // Show edit buttons where click on edit item.
        addItemToForm: function () {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
    }
})();

// App Controller
const App = ((ItemCtrl, StorageCtrl, UICtrl) => {
    //Load event listeners
    const loadEventListeners = function () {
        const UISelectors = UICtrl.getSelectors();
        //Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        // Disable submit on "enter"
        document.addEventListener('keypress', function (e) {
            if (e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        });

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        //Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        //Back button event
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        //Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        //Clear all items 
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

    }

    const itemAddSubmit = function (e) {
        const input = UICtrl.getItemInput();
        // Check for name and calorie input
        if (input.name !== '' && input.calories !== '') {
            // Add item 
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            //Add item to UI list
            UICtrl.addListItem(newItem);
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            //Show total calories in UI
            UICtrl.showTotalCalories(totalCalories);
            // Store in local storage
            StorageCtrl.storeItem(newItem);
            //Clear input fields
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    const itemUpdateSubmit = function (e) {
        // Get item input
        const input = UICtrl.getItemInput();
        // Update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        // Update UI
        UICtrl.updateListItem(updatedItem);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Show total calories in UI
        UICtrl.showTotalCalories(totalCalories);

        //Update local storage
        StorageCtrl.updateItemStorage(updatedItem);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Edit item. Event delegation
    const itemEditClick = function (e) {
        if (e.target.classList.contains('edit-item')) {
            // Get list item id (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id; // get only id from all posible
            const listIdArr = listId.split('-'); // item-0
            // Get the actual id
            const id = parseInt(listIdArr[1]);
            //Get item
            const itemToEdit = ItemCtrl.getItemById(id);
            ItemCtrl.setCurrentItem(itemToEdit);
            //Add item to form
            UICtrl.addItemToForm();

        }

        e.preventDefault();
    }

    const itemDeleteSubmit = function (e) {
        // Get current item
        const currentItem = ItemCtrl.getCurrentItem();
        //Delete item from data structure
        ItemCtrl.deleteItem(currentItem.id);
        // Delete from UI
        UICtrl.deleteListItem(currentItem.id);
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Show total calories in UI
        UICtrl.showTotalCalories(totalCalories);

        //Delete from local storagge
        StorageCtrl.deleteItemFromStorage(currentItem.id);

        e.preventDefault();
    }

    //Clear all items event
    const clearAllItemsClick = function () {
        // Delete all items from data structure
        ItemCtrl.clearAllItems();
        //Remove items from UI
        UICtrl.removeItems();
        //Hide ul
        UICtrl.hideList();
        //Clear from local storage
        StorageCtrl.clearItemsFromStorage();
        // Get total calories
        const totalCalories = ItemCtrl.getTotalCalories();
        //Show total calories in UI
        UICtrl.showTotalCalories(totalCalories);   

    }

    return {
        init: function () {

            // Hide buttons
            UICtrl.clearEditState();

            // Fetch items from data structure
            const items = ItemCtrl.getItems();

            //Check if any items
            if (items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            };

            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();

            //Show total calories in UI
            UICtrl.showTotalCalories(totalCalories);

            // Load event listeners
            loadEventListeners();

        }
    }

})(ItemCtrl, StorageCtrl, UICtrl);

App.init();
