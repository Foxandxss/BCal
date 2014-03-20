module.exports = function(lineman) {
  //Override application configuration here. Common examples follow in the comments.
  return {

    server: {
      pushState: true
    },

    ngtemplates: {
      app: { // "app" matches the name of the angular module defined in app.js
        options: {
          base: "app/js"
        },
        src: "app/js/**/*.tpl.html",
        // puts angular templates in a different spot than lineman looks for other templates in order not to conflict with the watch process
        dest: "generated/angular/template-cache.js"
      }
    },

    watch: {
      ngtemplates: {
        files: "app/js/**/*.tpl.html",
        tasks: ["ngtemplates", "concat_sourcemap:js"]
      
      }

    }
  };
};