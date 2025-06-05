const socket = io();

const productList = document.getElementById('productList');

socket.on('productList', products => {
    productList.innerHTML = '';
    products.forEach(p => {
        const li = document.createElement('li');
        li.textContent = `${p.title} - $${p.price}`;
        productList.appendChild(li);
    });
});

productForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(productForm));
    data.price = parseFloat(data.price);
    socket.emit('addProduct', data);
    productForm.reset();
});

deleteForm.addEventListener('submit', e => {
    e.preventDefault();
    const id = deleteForm.elements['id'].value;
    socket.emit('deleteProduct', id);
    deleteForm.reset();
});
