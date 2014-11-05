var moviesCollection;
var searchTerm;
var Movie = Backbone.Model.extend({
//set a property on initialization called runtimeHours
    initialize: function(){
        this.runtimeHours();
    },
    runtimeHours: function(){

        var runtime = this.get("runtime");
        //console.log(runtime);
        var hours = Math.floor(runtime/60);
        var minutes = 0;
        if(runtime >= 60*hours){
            minutes = runtime - 60*hours;
        }
        else{
            minutes = runtime;
        }
        var hoursMinutes = hours + " Hour(s) " + minutes + " Minutes";
        this.set('movieLength',hoursMinutes);

    }
});

var MovieCollection = Backbone.Collection.extend({

    model: Movie
});

//var moviesCollection = new MovieCollection(movieInfo); //need to pass in JSON data here

var MovieItemView = Backbone.View.extend({
    template: Handlebars.compile($('#page-template').html()),

    render: function(){
        var html = this.template(this.model.toJSON());
        this.$el.html(html);
    }
});

var MoviesView = Backbone.View.extend({
    render: function(){
        this.el.innerHTML = "";
        //collection is not an array, so we use each, looping through all, each have a review
        this.collection.each(function(model){
            var view = new MovieItemView({
                model: model
            });

            view.render();
            //must append to reviewsView element
            this.$el.append(view.el);

        }, this);

        //loop over the collection
        //for each model, create a new ReviewItemView, view that manages a single review
        //render ReviewView
    }
});
var moviesView = new MoviesView({
    collection: moviesCollection,
    el: '#page-template'
});


function search(searchTerm){
    return $.getJSON("http://api.rottentomatoes.com/api/public/v1.0/movies.json?q=" + searchTerm + "&page_limit=40&page=1&apikey=uept5vw7b3vsqcj9gykfj9cs&callback=?");

}

$('form').on('submit', function(e){
    e.preventDefault();

    searchTerm = $('#search-term').val();

    $('#results').html('Loading....');

    search(searchTerm).then(function(data){

        moviesCollection = new MovieCollection(data.movies);

        var moviesView = new MoviesView({
            collection: moviesCollection,
            el: '#results'
        });


        moviesView.render();
        //$('#container').append(moviesView.el);
    })
});

