Vue.component('cart', {
    data(){
      return {
          cartItems: [],
          showCart: false
      }
    },
    mounted(){
        this.$parent.getJson(`/api/cart`)
            .then(data => {
                for (let item of data.contents){
                    item.img = `img/imgProducts/${item.id_product}.png`
                    this.$data.cartItems.push(item);
                }
            });
    },
    methods: {
        addProduct(item){
            let find = this.cartItems.find(el => el.id_product === item.id_product);
            if(find){
                this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1})
                    .then(data => {
                        if(data.result === 1){
                            find.quantity++
                        }
                    })
            } else {
                const prod = Object.assign({quantity: 1}, item);
                this.$parent.postJson(`/api/cart`, prod)
                    .then(data => {
                        if(data.result === 1){
                            this.cartItems.push(prod)
                        }
                    })
            }

        },
        remove(item){
                if ( item.quantity > 1 ) {
                    this.$parent.putJson( `/api/cart/${ item.id_product }`, { quantity: -1 } )
                        .then( data => {
                            if ( data.result === 1) {
                                item.quantity--;
                            }
                        } )
                } else {
                    this.$parent.delJson( `/api/cart/${ item.id_product }`, item )
                        .then( data => {
                            if ( data.result === 1 ) {
                                this.cartItems.splice( this.cartItems.indexOf( item ), 1 );
                            } else {
                                console.log( 'error' );
                            }
                        } )
                }
        }
    },

    computed: {
        totalCost () {
            return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        }
    },

    template: `<div>
                    <button class="cart-img" type="button" @click="showCart = !showCart"><img src="img/cart.png" alt="cart"></button>
                    <div class="cart-field" v-show="showCart">
                        <p class="cart-empty"v-if="!cartItems.length">Cart is empty</p>
                        <cart-item v-for="item of cartItems" :key="item.id_product" :img="item.img" :cart-item="item" @remove="remove">
                        </cart-item>
                        <div class="cart-total">TOTAL <span style="padding-left: 120px;">$ {{totalCost}} </span></div>
                        <div class="cart-checkout">
                            <a href="checkout.html" class="cart-checkout-btn">CHECK OUT</a>
                        </div>
                        <div class="cart-go-to">
                            <a href="shopping-cart.html" class="cart-go-to-btn">GO&nbsp;TO&nbsp;CART</a>
                        </div>
                    </div>
                </div>
                `
});

Vue.component('cart-item', {
    props: ['img', 'cartItem'],
    template: `
                <div class="cart-item">
                       <div class="cart-product">
                            <img class="cart-img-product":src="img" alt="">
                            <div class="cart-desc">
                                <a href="product.html" class="cart-product-title">{{ cartItem.product_name }}</a>
                                <div class="stars-quantity"><i class="fa fa-star" aria-hidden="true"></i><i
                                        class="fa fa-star" aria-hidden="true"></i><i class="fa fa-star"
                                        aria-hidden="true"></i><i class="fa fa-star" aria-hidden="true"></i><i
                                        class="fa fa-star" aria-hidden="true"></i>
                                </div>
                                <div class="quantity-price">{{ cartItem.quantity }}x{{ cartItem.price }}$</div>
                            </div>
                            <button class="cart-reset-btn" @click="$emit('remove', cartItem)"><i
                                        class="fas fa-times-circle"></i></button>
                            
                        </div>
                </div>
                
             `
})