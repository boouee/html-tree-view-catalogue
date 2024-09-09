async function loadTree(data) {
    var tree = await $('#tree1').tree({
        data: data
    });
    console.log('loading')
    tree.treeview({
      collapsed: true,
      animated: 'medium',
      unique: false
    });
    console.log('styling', data[0]);
    /**var output = [];
    find(data, '10',  'item', output)
    output.forEach((i) => console.log(i))
    displayTable(output)**/
    return 'done';

}
var currentTableList = []; 
var cart = [{}];
var isCart = false;
var selected;
fetch('./data.json')
.then((response) => response.json())
.then(function(json) {loadTree(json); searchHandler(json);
//addToCartHandler(json);
cartHandler(json)
}).then(treeClickHandler()).then();
//console.log(data);

function treeClickHandler() {
  $('#tree1').on(
    'tree.click',
    function(event) {
        // The clicked node is 'event.node'
        var node = event.node;
        //alert(node.name);
        const table = displayTable(node.children);
        currentTableList = node.children;
        const tableContainer = document.getElementById('table-container');
        tableContainer.innerHTML = '';
        tableContainer.appendChild(table);
        
    }
  );
}
function tableClickHandler(partNumber) {
  //console.log(event.target)
    var node = currentTableList.find((child) =>  child.part_number == partNumber);
    if (!node) return;
    if (node.children.length < 1) return;
    currentTableList = node.children;
    console.log(node) 
    if (document.getElementById('table-container').getAttribute('name') == 'list') displayTable(currentTableList)
}

function searchItem(node, output) {
}

console.log('hello')

function find(array, value, type, output) {
    //var output = [];
    //console.log('search started', type, Object.keys(array[0]));
    if (typeof array != 'undefined') {
        for (var i = 0; i < array.length; i++) {
            //console.log(array[0], array[0]['item'])
            if (array[i][type]== value) output.push(array[i]);
            find(array[i].children, value, type, output)
            //var childrenOutput = output. push(find(Array.from(array[i].children), value, type))//.forEach((childOutput) => output.push(childOutput)) 
        }
    }
    console.log(output[0])
    //displayTable(output)
    //return output;
}

function searchHandler(data) {
    const form = document.getElementById('search');
    console.log('search handler', data[0]);
    form.addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('submitted')
    
    console.log(form.value.value , data[0])
    var output= [];
    find(data, form.value.value, form.type.value, output)
    if (output.lenght == 0) { 
        $('#searchFailedModal').modal('show');
    } else {
        displayTable(output)  
        currentTableList = output;
    }
    
    //console.log(typeof currentTableList.children, typeof currentTableList.children[0], typeof output, typeof output[0]);
})
}

/**function addToCartHandler(partNumber, container) {
  /**const addToCart = document.getElementById('addToCart');
  addToCart.addEventListener('click', function(event){
     cart.push(selected);
      const encoded = encodeURIComponent(displayTable (cart).innerHTML)//"<table>" + selected.toString() + "</table>")
     fetch('https://intrumnet-kv.vercel.app?text=' + encoded)
  })**/

/**    if (event.target.className == "addToCartButton" && partNumber.length > 0) {
        if (container.getAttribute('name') == 'list' ) {
            cart.push(currentTableList.find((child) => child.part_number == partNumber));
        } else {
            cart = cart.filter((child) => child.part_number != partNumber);
            console.log(cart)
            displayTable(cart, true)
        }
    }
}*/

function cartHandler() {
    //const cartButton = ;
    document.getElementById('cart').addEventListener('click', function(event){
         displayTable(cart, true) 
      })
    document.getElementById('directory').addEventListener('click', function(event){
         displayTable(currentTableList) 
      })
}

/**function sendMail() {
    const encoded = encodeURIComponent(displayTable(cart, true).innerHTML)//"<table>" + selected.toString() + "</table>")
    fetch('https://intrumnet-kv.vercel.app?text=' + encoded)
}**/

async function sendMail() {
  const encoded = encodeURIComponent(displayTable(cart, true).innerHTML)
  const url = 'https://intrumnet-kv.vercel.app?text=' + encoded;
  try {
    const response = await fetch(url, {
        headers: {
            
        }
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    } else {
        $('#emailSentModal').modal('show');
        //alert('Сообщение отправлено');
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.error(String(error.message));
  }
}

document.getElementById('table-container').addEventListener('click', function (event) {
  
    const target = event.target.closest('.image-icon');
    if (!target) return;

    // Set the src attribute of the modal image
    const imagePath = target.getAttribute('path');
    modalImage.src = `${imagePath}`;
});

document.getElementById('sendmail').addEventListener('click', function (event) {
    sendMail();
    
})