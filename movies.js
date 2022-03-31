/* Movie Choice Algorythm/Iteration based on file name */
"use strict";

const d = new Date(),
  /* IN CASE IMAGE FOR SPECIFIC MOVIE IS NOT FOUND */
  putCap = 'src="https://via.placeholder.com/1080x608.png?text=Movie+Poster+Not+Available"',
  /* API CREDENTIALS / OPTIONS - ONLY TO GET THE SHORT VERSION OF PLOT AT THIS STAGE  */
  omdbAPI = "https://www.omdbapi.com/",
  keyAPI = "xxx",
  plotLength = "short";
/* HTML OUTPUT ELEMENTS */
let htmlOutput = document.getElementById("myData"),
  yearOutput = document.getElementById("year"),
  movieTitlesTotal = document.getElementById("total"),
  movieName = document.getElementById("movieName"),
  movieSize = document.getElementById("movieSize"),
  movieTimePosted = document.getElementById("movieTimePosted"),
  weHaveSuccess = false,
  /* DETAILS */
  year = d.getFullYear(),
  moviesDomain = "https://www.yourdomain.com",
  moviesFolder = "/movies";
yearOutput.innerHTML = "Escolha para " + year;
document.title = "Escolha de Azorano para " + year;

/* FUCTION TO GET IMAGE HEADER AND CHECK IF EXISTS ON THE SERVER */
function doesImageFileExist(imageURL) {
  let xhr = new XMLHttpRequest();
  xhr.open("HEAD", imageURL, false);
  //xhr.send();
  if (xhr.status === 404) {
    console.log("404");
    return false;
  } else {
    return true;
  }
}

/* STARTS AJAX FETCHING */
$.ajax({
  type: "GET",
  url: moviesDomain + moviesFolder,
  dataType: "json",
  success: function (data) {
    console.log(" ************************* TITLES FETCH STARTING ************************* ");
    for (let i = 0; i < data.length; i++) {
      /* RETRIEVES JSON DATA FROM URL AND STORES THEM INTO VARIABLES*/
      let jsMovieID = [i],
        jsMovieName = data[i].name,
        jsMovieTimePosted = data[i].mtime,
        jsMovieSize = data[i].size,
        /* TRANSLATE THAT GIGBYTE NUMBER ONTO HUMAN READABLE ONE */
        resultMovieSize = (jsMovieSize / 1073741824).toFixed(2),
        /* GET THE IMAGE FOR EACH MOVIE, BASED ON MOVIE ID (HAND INCREMENTED, AND STORED) */
        putImage = "src=" + moviesDomain + "/images/moviePosters/" + jsMovieID + ".jpg",
        resultThereIsImage = "",
        resultTheMovieYearFinal = "",
        imageURL = moviesDomain + "/images/moviePosters/" + jsMovieID + ".jpg";
      /* CHECKS IF IMAGE FILE EXISTS AND POPULATES IMAGE FIELD*/

      if (doesImageFileExist(imageURL)) {
        resultThereIsImage = putImage;
      } else {
        resultThereIsImage = putCap;
      }
      /* WE KEEP GETTING THINGS GOING ABOUT MAKING THE MOVIE NAME TITLE PRETTIER THAN EVER  */
      /*
      ** MOVIES NEED TO FOLLOW THIS PATTERN **
      FILE SAVING OUTPUT FROM VIDEO CONVERTER LOOKS LIKE THIS:
      08_pt_tt0208092_Snatch_2000_x264.mp4
      id_language_IMDBuniqueID_MovieTitle_Year_encoding.extension
      */
      /* FIRST WE GET IMDB ID - TO GET MOVIE UNIQUE INFO */
      let idIMDB = jsMovieName.match(/[tt]+[0-9]+/),
        /* NEXT WE GET THE LANGUAGE IT IS SUBTITLED (FURTHER DEVELOPMENT FOR OTHER LANGUAGES) -- CAN BE ENGLISH OR PORTUGUESE */
        subtitPT = jsMovieName.match(/_pt_/g),
        subtitEN = jsMovieName.match(/_en_/g),
        /* THIS WILL HANDLE FILES WITHOUT SUBTITLES */
        subtitNoSub = jsMovieName.match(/_nosub_/g),
        subtitFinal = "",
        /* WE KEEP GETTING THINGS GOING ABOUT MAKING THE MOVIE NAME TITLE PRETTIER THAN EVER - WITH EVEN MORE MINOR TWEEKS */
        resultMovieName = jsMovieName.replace("tt", "").replace("dont", "Don't").replace(/__/g, ": ").replace("dn", "").replace(/_en_/g, "").replace(/_pt_/g, "").replace(/_/g, " ").replace(/x264/g, "").replace(/ .mp4/g, "").replace(/[0-9]/g, ""),
        /* THIS GET MOVIE YEAR FROM FILE NAME */
        resultTheMovieYear = jsMovieName
          .replace(/.mp4/g, "")
          .replace(/_x264/g, "")
          .match(/[0-9]{4}$/);
      /* HANDLE EMPTY MOVIE YEAR */
      resultTheMovieYear === null ? (resultTheMovieYearFinal = "---") : (resultTheMovieYearFinal = resultTheMovieYear);
      /* HANDLE EMPTY SUBTITLES */
      if (subtitNoSub) {
        subtitFinal = "no subtitles";
      } else {
        subtitFinal = subtitEN ? "EN" : "PT";
      }
      /* GET THE PLOT FROM API */
      let urlAPI = omdbAPI + "?apikey=" + keyAPI + "&i=" + idIMDB + "&plot=" + plotLength;
      /* FETCH API DATA */
      async function getAPIdata(a) {
        /* FETCHES DATA IN A FORM OF AN OBJECT */
        let object = await fetch(a),
          /* WAITS EACH BLOCK OF DATA TO ARRIVE AND TURNS DATA INTO JSON */
          data = await object.json(),
          /* STORES PLOT */
          plotEN = data.Plot;
        /* STORES MOVIE LENGTH */
        let movieLength = data.Runtime,
          /* YEAH. HOW LONG A SHORT PLOT CAN BE... WE LIMIT IT TO 110 CHARS WITH SPACES AND GET THE LAST CHAR FOR TESTING */
          more = plotEN.substring(0, 110).slice(-1);

        /* THERE'S A SPECIFIC GLITCH WITH ONE OF THE PLOTS, WHICH ENDS WITH A 'D' CHAR AND MESSES UP THE IDEA. SO, THERE WAS THE NEED OF A HOT FIX TO CHECK WHAT'S THE LAST CHAR AND OUTPUT '...' ON THAT BASIS */
        if (more === "D") {
          more = "";
          /* IF IT FINISHES WITH A '.' DOT. IT JUST FINISHES, AS THERE IS NO NEED FOR '...' */
        } else if (more === ".") {
          more = "";
        } else {
          more = "...";
        }
        /* FIRST IT CHECKS IF MOVIE SIZE IS BIGGER THAN 1GB, AS WE WANT HERE HD MOVIES ONLY. THEN CHECKS IF FILE IS FINAL, AND NOT BEING UPLOADED AT THAT GIVEN MOMENT (***.tmp). IF THE 2 OF THEM ARE MET, TRIGGER OUTPUT */
        if (jsMovieSize > 1073741824 && !resultMovieName.match(/.tmp/)) {
          html_output.innerHTML +=
            '<div class="card my-4 shadow_ view overlay hoverable" style="width: 17rem; height: auto;"> <img class="card-img-top" ' +
            /* OUTPUTS THE IMAGE, OR A PLACEHOLDER IF DOESN'T EXIST */
            //console.log(resultThereIsImage);
            resultThereIsImage +
            ' alt="' +
            /* OUTPUTS IMAGE ALT BASED ON MOVIE NAME - HELPS SEARCH ENGINES, YOU KNOW... MANDATORY FOR REAL CASE SCENARIOS */
            resultMovieName +
            ' banner poster cap"><div class="card-body"><h5 id="movieName" class="card-title font-weight-bold text-center text-capitalize d-flex justify-content-center align-items-center" style="height: 70px; overflow: hidden;">' +
            /* OUTPUTS THE PRETTY MOVIE NAME */
            resultMovieName +
            '</h5><article lang="en"><p class="card-text d-flex align-items-baseline plot" data-toggle="tooltip" data-html="true" title="' +
            /* THIS OUTPUTS ON A TOOLTIP, ALL THE (SHORT) PLOT */
            plotEN +
            '">' +
            /* HERE OUTPUTS PLOT TILL 110 CHARS */
            plotEN.substring(0, 110) +
            "" +
            /* AND HERE THE DECISION OF USING ETC OR NOT AS STATED ABOVE */
            more +
            '</p></article><hr><div class="surplus_info"><div class="mt-3 d-flex justify-content-between align-items-middle"><div id="movieTimePosted" class="small"><strong>Ano: </strong>' +
            resultTheMovieYearFinal +
            '</div><div id="movieSize" class="small"><strong>' +
            /* OUTPUTS PRETTY FILE SIZE */
            resultMovieSize +
            "Gb" +
            '</strong></div></div><div class="d-flex justify-content-between align-items-middle"><small><strong>IMDB:</strong> ' +
            /* OUTPUTS IMDB RATING */
            data.imdbRating +
            "</small><small>" +
            /* OUTPUTS MOVIE LENGTH */
            movieLength +
            '</small></div><div class="d-flex justify-content-between align-items-middle"><small><strong>Legendas:</strong> ' +
            /* OUTPUTS THE MOVIE SUBTITLE LANGUAGE */
            subtitFinal +
            '</small></div></div><div class="mt-4 col-auto text-center"><a href="' +
            /* BUILDS A LINK TO OPEN THE LINK IN A NEW BLANK TAB, FOR LIVE MOVIE WATCH */
            movieFolder +
            jsMovieName +
            '" class="btn btn-primary w-65" target="_blank"><i class="fa fa-play"></i></a></div></div><div class="text-center pb-1" style="font-size:8px;"><em>' +
            /* GIVES US DATE AND TIME THE FILE WAS CREATED */
            jsMovieTimePosted +
            "</em></div></div>";
        } else {
          ("<p>noting</p>");
        }
      }
      /* TRIGGERS DATA FETCH ON EACH ITERATION */
      getAPIdata(urlAPI);
      /* GETS OBJECT LENGTH */
      let totalTitles = data.length;
      /* DISPLAYS HOW MANY MOVIES ARE ON THE LIST ...DETAILS... */
      movieTitlesTotal.innerHTML = totalTitles + " títulos";
    }
  },
  error: function (data) {
    /* ERROR HANDLING */
    console.log(data);
    html_output.innerHTML = "<div class='col-12 small text-left py-5'>Couldn't retrieve the data. Please refresh the page.</div><div class='col-12 small text-left'>" + data.statusText + "</div>";
  },
  complete: function () {
    /* ON SUCCESS */
    if (!weHaveSuccess) {
      console.log("All Data Retrieved");
    }
  },
});
