var app = new Vue({
    el: '#blog',
    data: {
        loading: true,
        posts: []
    },
    mounted: function() {
        this.fetchPosts();
    },
    methods: {
        fetchPosts: function() {
            var vm = this;
            fetch('https://quoralis-api-tieomtgsut.now.sh/posts', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(posts) {
                    vm.posts = posts[0].item;
                    vm.loading = false;
                })
                .catch(function(error) {
                    console.log(error);
                    vm.loading = false;
                });
        }
    }
});