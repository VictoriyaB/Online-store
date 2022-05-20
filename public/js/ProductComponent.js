Vue.component('products', {
   data(){
       return {
           catalogUrl: '/catalogData.json',
           filtered: [],
           products: [],
       }
   },
    mounted(){
        this.$parent.getJson(`/api/products`)
            .then(data => {
                for (let item of data){
                    item.img = `img/imgProducts/${item.id_product}.png`
                    this.$data.products.push(item);
                    this.$data.filtered.push(item);
                }
            });
    },
    methods: {
        filter(userSearch){
            let regexp = new RegExp(userSearch, 'i');
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
        }
    },
   template: `<div class="products">
                <product v-for="item of filtered" 
                :key="item.id_product" 
                :img="item.img"
                :product="item"
                @add-product="$parent.$refs.cart.addProduct"></product>
               </div>`
});
Vue.component('product', {
    props: ['product', 'img'],
    template: `
            <div class="featured-items-block">
                    <img class="feautured-items-img" :src="img" alt="some img">
                    <div class="feautured-items-overlay">
                        <button class="feautured-items-hover-btn" @click="$emit('add-product', product)"><img class="white-cart-img" src="img/white-cart.png"
                                alt="cart"> Add to&nbsp;cart</button>
                    </div>
                    <a href="single-page.html" class="product-items-link">
                    <div class="featured-items-block-down">
                        <p class="product-items-name">{{product.product_name}}</p>
                        <span class="items-price">$ {{product.price}}</span>
                    </div>
                    </a>
                </div>
    `
})