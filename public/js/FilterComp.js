Vue.component('filter-el', {
    data(){
      return {
          userSearch: ''
      }
    },
    template: `
                <form action="#" class="search-form" @submit.prevent="$parent.$refs.products.filter(userSearch)">
                <input v-model="userSearch" class="search-form-field" type="text" placeholder="Search for Item...">
                <button class="search-form-btn" type="submit"><i class="fas fa-search"></i></button>
                </form>
             `
})