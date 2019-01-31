var app = new Vue({
  el: "#contact",
  data: {
    name: "",
    email: "",
    message: "",
    errors: [],
    response: null,
    loading: false
  },
  computed: {
    success: function() {
      return this.response && this.response.statusCode === 200;
    },
    formVisible: function() {
      return !this.response || !this.success;
    }
  },
  methods: {
    submit: function() {
      var vm = this;
      if (this.validateForm()) {
        vm.loading = true;
        fetch("/api/contact", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: vm.name,
            email: vm.email,
            message: vm.message
          })
        })
          .then(function(response) {
            return response.json();
          })
          .then(function(data) {
            vm.loading = false;
            vm.response = data;
          });
      }
    },
    validateForm: function() {
      var errors = [];

      if (this.name.length <= 0) {
        errors.push("Please enter your name.");
      }

      if (this.email.length <= 0 || !this.validateEmail(this.email)) {
        errors.push("Please enter a valid email address.");
      }

      if (this.message.length <= 0) {
        errors.push("Don't forget to enter your message!");
      }

      this.errors = errors;
      return errors.length === 0 ? true : false;
    },
    validateEmail: function(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
  }
});
