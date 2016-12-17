/**
 * Project Name: Movies in a Snap!
 * File Name: script.js
 * Author: Collette Tamez, Daniel Lee, Dave Weizenegger, Kyle Marx
 * Date: 09/21/2016
 * Objective: Hackathon project involving the combination of different data sources into an application or game
 * Prompt: https://github.com/Learning-Fuze/c10_api_hackathon/
 */

/**
 * Listen for the document to load and calls addClickHandlers function
 */
$(document).ready(function () {
    addClickHandlers();
    
});

function toggleIt() {
    var $this = $(this);
    var id = $this.attr('id').replace(/play/, '');
    $this.toggleClass('active');
    if($this.hasClass('active')){
        $this.text('pause'); 
        var textShadow = "#track" + id;
        $(textShadow).css('text-shadow', '2px 2px 8px #FF0000');
        var player = '#music' + id;
        $(player).get(0).play();        
    } else {
        $this.text('play');
        var textWhite = "#track" + id;
        $(textWhite).css('text-shadow', '');
        var pauser = '#music' + id;
        $(pauser).get(0).pause();
    }
}

function stopVideo(player) {
        var vidSrc = player.attr('src');
        player.attr('src', ''); // to force it to pause
        player.attr('src', vidSrc);
  };

// function expandIt() {
//     $('#divForLargeImage').css('visibility', 'visible');
//     $('#divForImage').css('visibility', 'hidden');
// }

// function shrinkIt() {
//     $('#divForLargeImage').css('visibility', 'hidden');
//     $('#divForImage').css('visibility', 'visible');
// }

function imageToggle() {
    $div = $('#divForLargeImage');
    if ($div.hasClass('active')) {
        // var width = $(document).width();
        // console.log(width);
        // $div.find('img').css('width', width);
        $div.fadeOut();
    } else {
        $div.fadeIn();
    }
    $div.toggleClass('active');
}

/**
 * addClickHandlers - and click handler functions to button in DOM with id of movieInfo
 */
function addClickHandlers() {
    $("#movieInfo").click(movieSearch);
    $('#search').keyup(function(e) {
        if (e.which === 13) {
            movieSearch();         
        }
    });
    $("#random").click(quoteToMovie);
    $('#vidBtn').click(playVideo);
    $('#infoToggle').click(infoToggle);
    $('.play').click(toggleIt);
    $('#imageToggle').click(imageToggle);
    $('#divForLargeImage').click(imageToggle);
}

    


/**
 * makeFirstAjaxCall - makes a request to The Movie DB to return search results via AJAX
 * @param movie
 */
function makeTmdbAjaxCall(movie) {
    /**
     * dataToSendServerForFirstCall - local variable that holds the data to send to The Movie DB database API in the first AJAX call
     * @type {{api_key: string, query: *}}
     */
    var dataToSendServerForFirstCall = {
        api_key: "7e73e5037ed00682f5aae1e5b6d940a4",
        query: movie
    };
    /**
     * dataToSendServerForSecondCall - local variable that holds the data to send to The Movie DB database in the second AJAX call
     * @type {{api_key: string}}
     */
    var dataToSendServerForSecondCall  = {
        api_key: "7e73e5037ed00682f5aae1e5b6d940a4"
    };
    /**
     * AJAX call to The Movie Database API that performs a search query based on the keyword variable
     */
    $.ajax({
        data: dataToSendServerForFirstCall,
        dataType: "JSON",
        method: "GET",
        url: "https://api.themoviedb.org/3/search/movie?",
        /**
         * anonymous error function - lets the user know their search was invalid
         * @param response
         */
        error: function (response) {
            $("<h1>").text("We couldn't find anything!").appendTo("#divForQuote");
        }
        /**
         * anonymous success function - executes on success of first ajax call?
         * @param response
         */
    }).then(function (response) {
        /**
         * result - local variable that stores the object at index zero of the key "results" array in response object
         */
        var result = response.results[0];
        /**
         * movieID - local variable that stores the value of the key id in the results variable
         */
        var movieID = result.id;
        /**
         * url - stores the url to be sent to the data base that includes the necessary path parameter
         * @type {string}
         */
        var urlForMovieData = 'https://api.themoviedb.org/3/movie/' + movieID + '?';
        /**
         * ajax call to The Movie DB API to retrieve detailed movie information
         */
        $.ajax({
            data: dataToSendServerForSecondCall,
            dataType: "JSON",
            method: "GET",
            url: urlForMovieData,
            /**
             * anonymous error function - lets the user know there was an error
             * @param response
             */
            error: function (response) {
                $("<h1>").text("We couldn't find anything!").appendTo("#divForQuote");
            },
            /**
             * anonymous success function - on successful request appends selected information to DOM
             * @param response
             */
            success: function (response) {
                /**
                 * result - local variable that stores the response object
                 */
                var movieData = response;
                /**
                 * moviePoster - local variable that concats URL needed to resolve a TMDB image and the backdrop_path image file path in response object
                 * @type {string}
                 */
                var moviePoster = "http://image.tmdb.org/t/p/original" + movieData.backdrop_path;
                $("#divForMovieInfo").empty();
                $("#divForLargeImage").empty();
                $("<img>").attr({
                    src: moviePoster
                }).appendTo("#divForImage");
                $("<img>").attr({
                    src: moviePoster
                }).appendTo("#divForLargeImage");
                if (!quoteFlag) {
                    $("<h2>").text(movieData.tagline).css('font-style', 'italic').appendTo("#divForQuote");
                }
                $("<h1>").text(movieData.original_title).appendTo("#divForMovieInfo");
                $("<h3>").text(movieData.release_date).appendTo("#divForMovieInfo");
                $("<p>").text(movieData.overview).appendTo("#divForMovieInfo");
                
            }
        })
    })
}

/**
 * playVideo - shows video when clicked
 */    
function playVideo() {
    var $this = $(this);
    $this.toggleClass('active');
    if($this.hasClass('active')){
        $this.text('Show Poster');        
        $('#divForTrailer').fadeIn('fast');
    } else {
        $this.text('Show Trailer');        
        stopVideo($('#youTubeVid'));
        $('#divForTrailer').fadeOut('fast');
    }
}

function infoToggle() {
    var $this = $(this);
    $this.toggleClass('active');
    if($this.hasClass('active')){
        $this.text('Show Info');
        $('.overlay').fadeOut('fast');
    } else {
        $this.text('Hide Info');        
        stopVideo($('#youTubeVid'));
        $('.overlay').fadeIn('fast');
    }
}

/**
 * quoteFlag - flag to indicate whether to show tagline or quote
 */
var quoteFlag = false;

/**
 * movieSearch - makes all the ajax calls to the different APIs
 */
function movieSearch() {
    quoteFlag = false;
    $("#divForImage").empty();
    $("#divForQuote").empty();
    $('#vidBtn').text('Show Video');
    $('#vidBtn').removeClass('active');
    $('#divForTrailer').fadeOut('fast');
    $('#divForMusicPlayer').css('visibility', 'visible');
    var search = $('#search').val();
    if(search != ''){
        makeTmdbAjaxCall(search);
        updateMovieTrailerByKeyword(search);
        searchItunes(search);
        $('#search').val('');
    }else
        quoteToMovie();
        $('#search').val('');
}


var timelineWidth = $('.timeline')[0].offsetWidth - $('.playhead')[0].offsetWidth;
/**
 * Function to start the ajax call to itunes
 */
function searchItunes(search) {
    var url = "https://itunes.apple.com/search?media=music&order=popular&term=" + search + " soundtrack&callback=?";
    $.getJSON(url, function (data) {

        $('#musicImg').attr('src', data.results[0].artworkUrl100);
        $('#artistName').text(data.results[0].collectionName);
        $('.playhead').css('margin-left', 0);
        for (var i=0; i<5; i++) {
            var trackStr = '#track' + (i+1);
            var musicStr = '#music' + (i+1);
            var result = data.results[i];
            $(trackStr).text(result.trackName);
            $(musicStr).off().attr('src', result.previewUrl).on('canplaythrough', function() {
                var $this = $(this);
                var music = $this[0];
                var $play = $this.nextAll('.play');
                var $timeline = $this.nextAll('.timeline');
                var $playhead = $timeline.find('.playhead');
                var timeupdate = function () {
                    var playPercent = timelineWidth * (music.currentTime / music.duration);
                    $playhead.css('margin-left', playPercent + 'px');
                    if (music.currentTime === music.duration) {
                        $play.removeClass('active');
                        $play.text('play');
                        $('#track' + $play.attr('id').replace(/play/, '')).css('text-shadow', '');
                    }
                }
                $this.on('timeupdate', timeupdate);

                var moveplayhead = function(e) {
                    var playheadRadius = $playhead[0].offsetWidth/2;
                    // var timelineOffset = $timeline[0].offsetLeft - $timeline[0].scrollLeft;
                    var timelineOffset = $timeline[0].getBoundingClientRect();
                    var newMargLeft = e.pageX - timelineOffset.left - playheadRadius;
                    if (newMargLeft >= playheadRadius && newMargLeft <= timelineWidth + playheadRadius) {
                        $playhead.css('margin-left', newMargLeft + "px");
                        music.currentTime = music.duration * (newMargLeft/timelineWidth);
                    }
                    if (newMargLeft < playheadRadius) {
                        $playhead.css('margin-left', "0px");
                        music.currentTime = 0;
                    }
                    if (newMargLeft > timelineWidth + playheadRadius) {
                        $playhead.css('margin-left', timelineWidth + "px");
                        music.currentTime = music.duration;
                        $play.removeClass('active');
                        $play.text('play');
                        $('#track' + $play.attr('id').replace(/play/, '')).css('text-shadow', '');
                    }
                }

                $timeline.on('click', moveplayhead);
            });
        }
        
    });
}

/**
 * quoteToMovie - makes an ajax call to famous quotes API and calls the makeTmdbAjaxCall function on success
 */
function quoteToMovie() {
    quoteFlag = true;
    $("#divForImage").empty();
    $("#divForQuote").empty();
    $('#vidBtn').text('Show Video');
    $('#vidBtn').removeClass('active');
    $('#search').text('');
    $('#divForMusicPlayer').css('visibility', 'visible');
    $('#divForQuote').css('visibility', 'visible');
    $('#divForTrailer').fadeOut('fast');
    $.ajax({
        type: "POST",
        headers: {
            "X-Mashape-Key": "OivH71yd3tmshl9YKzFH7BTzBVRQp1RaKLajsnafgL2aPsfP9V"
        },
        dataType: 'json',
        url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=movies'
    }).then(function(res) {
        ///console.log(res);
        /**
         * quote - local variable that holds value of the key "quote" in the response object
         */
        var quote = res.quote;
        /**
         * local variable that holds value of the key "author" in the response object
         * @type {*}
         */
        var movie = res.author;

        $("<h2>").text('"' + quote + '"').appendTo("#divForQuote");
        makeTmdbAjaxCall(movie);
        updateMovieTrailerByKeyword(movie);
        searchItunes(movie);
    })
}
/**
 * This function updates the movie trailer by searching for an video official movie trailer of the given movie on youTube.
 * The function will take a movie title (keyword) and appends the phrase ' official trailer' to the search term.
 * The video's ID is stored and then used in the appropriate attributes (href, data-videoid, and src) in the iframe video on the index to allow the movie to play.
 * Note that this sample limits the results to 1.
 * @param {string} keyword
 */
function updateMovieTrailerByKeyword(keyword) {
    keyword += ' official trailer';
    var result = null;
    $.ajax({
        dataType: 'jsonp',
        url: 'https://www.googleapis.com/youtube/v3/search',
        method: 'get',
        data: {
            key: 'AIzaSyCJxCXv2qoUoEDzB7_GvxXJe_SqCJT_KJg',
            q: keyword,
            part: 'snippet',
            maxResults: 1
        },
        success: function (response) {
            var videoId = response.items[0].id.videoId;
            var hrefMain = '//www.youtube.com/watch?v=';
            var srcMain = 'https://www.youtube.com/embed/';
            var srcExtra = '?cc_load_policy=1&amp;controls=2&amp;rel=0&amp;hl=en&amp;enablejsapi=1&amp;origin=https%3A%2F%2Fsupport.google.com&amp;widgetid=1&enablejsapi=1';

            $('#youTubeVid').attr({'href': hrefMain + videoId, 'data-videoid': videoId, 'src': srcMain + videoId + srcExtra});
        },
        error: function (response) {
            console.log('what a failure?');
        }
    });
}
    