var Crawler = require("node-webcrawler");
var fs = require('fs');

const START_URL = 'http://teknoaxe.com/Link_Code_3.php?q=1083';
const SONGS_JSON_PATH = 'songs.json';
const DOMAIN = 'http://teknoaxe.com/';

var songs = [];
var amount_songs_crawled = 0;

var songCrawler = new Crawler({
    maxConnections: 10,
    callback: function (error, result, $) {
        if (error) return;

        var songId = this.uri.match(/q=\d+/)[0].replace('q=', '');
        var genre = this.uri.match(/Genre=.+$/)[0].replace('Genre=', '');

        var name = $('#licenseinfo').children().eq(2).children().first().text().trim();
        var downloadUrl = $('#musicdownloadbutton').attr('href');

        songs.push({
            songId: songId,
            name: name,
            genre: genre,
            url: downloadUrl
        });

        amount_songs_crawled += 1;
        console.log(amount_songs_crawled);
    },
    onDrain: function (pool) {
        fs.writeFile(
            SONGS_JSON_PATH,
            JSON.stringify(songs),
            function (err) {
                if (err)
                    console.error("Error: Could not save songs to json.");
                else
                    console.log("Songs saved to '" + SONGS_JSON_PATH + "' file");
            }
        )
    }
});

var genreCrawler = new Crawler({
    maxConnections: 10,
    callback: function (error, result, $) {
        $(".genre_post").each(function (i, element) {
            var url = $(this).attr('href');
            songCrawler.queue(url)
        });

        total_songs_to_crawl = $("#wrapper").children('p').first().children('a').length;
    }
});

var genresListCrawler = new Crawler({
    maxConnections: 10,
    callback: function (error, result, $) {
        $(".music_link").each(function (index, element) {
            var url = $(this).attr('href');
            genreCrawler.queue(DOMAIN + url)
        });
    }
});

genresListCrawler.queue(START_URL);
