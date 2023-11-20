const cartObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if the changes are related to the cart update and run your code
            console.log('Cart updated in DOM');
        }
    });
});


const cartElement = document.querySelector('#CartElement'); // Select the appropriate element
if (cartElement) {
    cartObserver.observe(cartElement, { childList: true });
}
const cartObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            // Check if the changes are related to the cart update and run your code
            console.log('Cart updated in DOM');
        }
    });
});

const cartElement = document.querySelector('#CartElement'); // Select the appropriate element
if (cartElement) {
    cartObserver.observe(cartElement, { childList: true });
}
let lastCartCount = 0;

function pollCart() {
    fetch('/cart.js')
        .then(response => response.json())
        .then(cart => {
            if (cart.item_count !== lastCartCount) {
                lastCartCount = cart.item_count;
                // Cart count has changed, run your hook function
                console.log('Cart updated via polling');
            }
        });
}

setInterval(pollCart, 1000); // Poll every second

////
let productId = 0; // Replace with the actual product variant ID
let quantity = 1;
let customProperties = {
    'Custom Engraving Text': 'Happy Birthday To Mèo!',
    'Gift Wrap': 'Yes'
};
function getCart() {
    return fetch('/cart.js', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json());
}


getCart().then(cartContent => {
    console.log('Current cart content:', cartContent);
}).catch(error => {
    console.error('Error fetching cart:', error);
});
// Function to update a line item in the cart
function updateCartItem(lineKey, customProperties) {
    return fetch('/cart/change.js', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                line: 1,
                properties: customProperties
            }
        )
        }
        )
        .then(response => {
            if (response) {
                return response;
            }
            throw new Error('Network response was not ok.');
        });
}
function parseQueryString(queryString) {
    // Use URLSearchParams to parse the query string
    const params = new URLSearchParams(queryString);

    // Extract id and product_id
    const id = params.get('id');
    const productId = params.get('product-id');

    return { id, productId };
}

(function() {
    const originalFetch = window.fetch;
    window.fetch = function(url, config) {
        if (url.includes('/cart/add.js') && config && config.method === 'POST') {
            // Attempt to read the request body
            // const requestBody = JSON.parse(config.body);

            try {
                // Attempt to read and parse the request body
                requestBody = JSON.parse(config.body);
                productId = requestBody.id;
                console.log('Data sent to /cart/add.js:', requestBody);
            } catch (error) {
               let result =  parseQueryString(config.body);
                productId = result.id;
                console.error('Error parsing request body as JSON:', productId);
                // Handle the error or fail silently as needed
            }
        }

        return originalFetch.apply(this, arguments).then(response => {
            if (url === '/cart/add.js') {
                // Your code to run after the cart add request is done
                console.log('Item added to cart');

                getCart().then(cartData => {
                    console.log('Current cart content:', cartData);

                    let lineId = 1;
                    let current_properties = {};
                    let mergedProperties = {};
                    for (let i = 0; i < cartData.items.length; i++) {
                        if (cartData.items[i].id == productId ) {
                            // Found the item at the second position in the array
                            lineItemKey = cartData.items[i].key;
                            lineItemId = cartData.items[i].id;
                            lineId = i + 1;
                            console.log('lineId', lineId);
                            current_properties = cartData.items[i].properties;

                            mergedProperties = Object.assign({}, current_properties, customProperties);


                        }
                    }
                    // Now update the line item with the custom properties
                    updateCartItem(lineId, mergedProperties)
                        .then(updatedCart => {
                            console.log('Cart updated with custom properties:', updatedCart);
                        })
                        .catch(error => console.error('Error updating cart item:', error));
                }).catch(error => {
                    console.error('Error fetching cart:', error);
                });
            }
            return response;
        });
    };
})();

