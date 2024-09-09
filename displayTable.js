function displayTable(nodeChildren, isCart) {
    const tableContainer = document.getElementById('table-container');
    if (isCart) {tableContainer.setAttribute('name', 'cart')} else tableContainer.setAttribute('name', 'list');
    const children = Array.from(nodeChildren);
    if (children.length === 0) return;

    const hasItemColumn = children.some(child => child.hasOwnProperty('item'));
    const hasAVColumn = children.some(child => child.hasOwnProperty('assembly_version'));

    const table = document.createElement('table');
    table.className = 'table table-hover table-bordered';

    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');

    // Header row
    thead.innerHTML = `
        <tr>
            <th scope="col"></th>
            ${hasItemColumn ? '<th scope="col">Item</th>' : ''}
            <th scope="col">Part number</th>
            <th scope="col">Name</th>
            <th scope="col">Quantity</th>
            <th scope="col">Unit of Quantity</th>
            <th scope="col">S</th>
            <th scope="col">W</th>
            <th scope="col">P</th>
            ${hasAVColumn ? '<th scope="col">Assembly version</th>' : ''}
        </tr>
    `;

    // Sort children by Item
    children.sort((a, b) => parseInt(a.item) - parseInt(b.item));

    children.forEach(child => {
        const item = child.hasOwnProperty('item') ? child.item : '';
        const partNumber = child.hasOwnProperty('part_number') ? child.part_number : '';
        const name = child.hasOwnProperty('name') ? child.name : '';
        const quantity = child.hasOwnProperty('quantity') ? child.quantity : '';
        const unitOfQuantity = child.hasOwnProperty('unit_of_quantity') ? child.unit_of_quantity : '';
        const s = child.hasOwnProperty('s') ? (child.s === '1' ? '✓' : '') : '';
        const w = child.hasOwnProperty('w') ? (child.w === '1' ? '✓' : '') : '';
        const p = child.hasOwnProperty('p') ? (child.p === '1' ? '✓' : '') : '';
        const assemblyVersion = child.hasOwnProperty('assembly_version') ? child.assembly_version : '';
        const hasHiddenChildren = (child.hasOwnProperty('children') && child.children.length > 0);
        const hasImage = child.hasOwnProperty('image');

        // Create row for each child
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td class="p-1 text-nowrap">

                <span title="${hasHiddenChildren ? 'Assembly' : 'Part'}">
                    ${hasHiddenChildren ? '⚙️' : '🔧'}
                </span>
                <span class="addToCartButton">
                    ${isCart ? '&#128465' : '🛒'}
                </span>
                ${hasImage ? '<span><button type="button" class="btn p-0" data-bs-toggle="modal" data-bs-target="#imageModal"><span class="image-icon" title="Image"' + 'path="' + "static/img/" + child.image + '">📘</button></span>' : ''}
            </td>
            ${hasItemColumn ? `<td class="p-1 text-nowrap">${item || ''}</td>` : ''}
            <td class="p-1 text-nowrap">${partNumber}</td>
            <td class="p-1 text-nowrap">${name}</td>
            <td class="p-1 text-nowrap">${quantity}</td>
            <td class="p-1 text-nowrap">${unitOfQuantity}</td>
            <td class="p-1 text-nowrap">${s}</td>
            <td class="p-1 text-nowrap">${w}</td>
            <td class="p-1 text-nowrap">${p}</td>
            ${hasAVColumn ? `<td class="p-1 text-nowrap">${assemblyVersion || ''}</td>` : ''}
        `;
        tr.addEventListener('click', function (event) {
            console.log('row clicked', event.target)  
            //selected = child;
            tr.style.backg;
            if (event.target.className == "addToCartButton" && partNumber.length > 0) {
                if (tableContainer.getAttribute('name') == 'list' ) {
                    cart.push(currentTableList.find((child) => child.part_number == partNumber));
                    //alert('Добавлено в корзину');
                    $('#addToCartModal').modal('show');
                } else {
                    cart = cart.filter((child) => child.part_number != partNumber);
                    console.log(cart)
                    displayTable(cart, true)
                }
            }
            //selected.classList.remove('selectedrow');
            //alert(typeof child) 
        }) 
    tr.addEventListener('dblclick', function (event) {
        console.log('row clicked')  
            if (!isCart) tableClickHandler(partNumber)
        });
        tbody.appendChild(tr);
    });                

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
    return table;
}