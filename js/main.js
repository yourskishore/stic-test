var productsList = [];
var productsObj = {};
function getAllProducts(){
	$.ajax({
			url: "http://private-32dcc-products72.apiary-mock.com/product", 
			async:false,
			success: function(result){
				productsList = result;
				renderProductsList();
			}
		});
}

function renderProductsList(){
	var productLi = '';
	$.each(productsList, function(idx, eachProduct){
		productLi+= '<li id="product-li-'+eachProduct['id']+'"><div class="row"><div class="col-md-6 col-sm-6 mt-top">'+eachProduct['name']+'</div><div class="col-md-3 col-sm-3 mt-top"><span>Price:</span><span class="price-block">$'+eachProduct['price']+'</span></div><div class="col-md-3 col-sm-3"><button class="btn btn-success cd-add-to-cart" data-product-id="'+eachProduct['id']+'" data-price="'+eachProduct['price']+'"><span class="glyphicon glyphicon-shopping-cart"></span>Add to Cart</button></div></div></li>';
		
		productsObj[eachProduct['id']] = eachProduct;
	});
	
	$(".products-block ul.products-list-ul").html(productLi);
}


jQuery(document).ready(function($){
	var cartWrapper = $('.cd-cart-container');

	var productId = 0;
	var cartListTemplate = '<ul class="cart-list">{cartItems}</ul>';
	getAllProducts();
	
	$('body').tooltip({
		selector: '[data-toggle=tooltip]'
		//placement: 'right'
	});

	if( cartWrapper.length > 0 ) {
		//store jQuery objects
		var cartBody = cartWrapper;
		var cartList = cartBody.find('ul');
		var addToCartBtn = $('.cd-add-to-cart');
		
		//add product to cart
		addToCartBtn.on('click', function(event){
			event.preventDefault();
			addToCart($(this));
		});

	
		//delete an item from the cart
		cartList.on('click', '.delete-item', function(event){
			event.preventDefault();
			removeProduct($(this));
		});

		//update item quantity
		$('body').on('change keyup', '.count', function(event){
			quickUpdateCart($(this));
		});

	
	}

	function addToCart(trigger) {
		var cartIsEmpty = cartWrapper.hasClass('empty');
		productId = $(trigger).attr('data-product-id');
		addProduct(trigger);
		$('.empty-text').addClass('hidden');
		cartBody.removeClass('hidden');
		$("#product-li-"+productId).hide();
		
		updateCartTotal();
	}

	function addProduct(trigger) {
		productId = $(trigger).attr('data-product-id');
		productPrice = $(trigger).attr('data-price');
		
		var productData = productsObj[productId];
		var productAdded = $('<li class="product" id="product-block-'+productId+'"><div class="product-details"><div class="col-md-6 col-sm-6">'+productData['name']+'<span class="glyphicon glyphicon-info-sign" data-toggle="tooltip" title="'+(productData['description']!= undefined ? productData['description'] :'')+'"></span></div><div class="quantity col-md-3 col-sm-3"><input type="number" name="qty" id="qty" min="1" value="1" data-price="'+productPrice+'" data-product-id = "'+productId+'" class="form-control input-sm count"/></div><div class="col-md-3 col-sm-3">$<span class="price" data-price="'+productData['price']+'" id="product-total-price-'+productId+'">'+productPrice+'</span><span  data-product-id = "'+productId+'" class="glyphicon glyphicon-trash  delete-item"></span></div><br clear="all"/></div></li>');
		cartList.append(productAdded);
	}

	function removeProduct(item) {
		var productId = $(item).attr('data-product-id');
		$('#product-block-'+productId).remove();
		if(cartList.find('li').length < 1){
			$('.empty-text').removeClass('hidden');
			cartBody.addClass('hidden');
		}
		$("#product-li-"+productId).show();
		updateCartTotal();
	}

	function quickUpdateCart(input) {
		var quantity = $(input).val();
		var price = $(input).attr('data-price');
		var productId = $(input).attr('data-product-id');
		var totalPrice = quantity*price;
		setTimeout(function(){
			$('body').find("#product-total-price-"+productId).html(totalPrice.toFixed(2));
			updateCartTotal();
		},100);
	}

	function updateCartTotal() {
		var totalPrie = 0;
		cartList.find('li').each(function(){
			totalPrie+=parseFloat($(this).find('.price').html());
		});
		$("#total-price").html(totalPrie.toFixed(2));
	}
});