



var MovieInfo = function(){

	var movieInfo = null;
	var title = 'I am here';
	var year = '';
	var rated = '';
	var released = '';
	var runtime = '';
	var genre = '';
	var director = '';
	var writer = '';
	var actors = '';
	var plot = '';
	var language = '';
	var country = '';
	var awards = '';
	var poster = '';
	var metascore = '';
	var imdbRating = '';
	var imdbVotes = '';
	var imdbID = '';

	if(MovieInfo.instance){
	    return MovieInfo.instance;
	}

	MovieInfo.instance = this;
	return MovieInfo.instance;

};


MovieInfo.prototype.initialize = function() {
  	return this;
};

MovieInfo.prototype.info = function(movieTitle) {

	clearDataMovie();

	$.getJSON('http://www.imdbapi.com/?t=' + movieTitle, function(data) {
	})
	.done(function(data) {
		this.movieInfo = data;
		listenerMovieInfo(this.movieInfo);
    })
    .fail(function() {
        console.log("error");
    })
    .always(function() {

    });

    return Movie;

}

MovieInfo.prototype.getMovieInfo = function() {
		return this.movieInfo;
}

var Movie = new MovieInfo();

window.movieInfo = function () {
    return Movie.initialize();
}();


