const inquirer = require('inquirer');
const custom = require('custom-module');

const startProcess = async (artist,type) => {  //where all steps will be performed to search and fetch
    try {
        const artistAndId = await search(artist, type);
        const selectedArtist = await selectArtist(artistAndId);
        const artistSelected = selectedArtist.name[0];
        const artistId = getArtistId(artistSelected, artistAndId);
        const fetchArtist = await fetch(artistId);
        about(fetchArtist);
    } catch(err) {
        console.log(err);
        return err;
    }
};

//the search which contains our programs logic
//allow user to search. search artists and type, Ex: artists -> Drake, type -> album
const search = async (artist,type)=> {
    try {
      const response = await custom.searchResults(artist, type); //make search request (asynchronous)
      const artistsAndId = []; //array to store artists with their assigned id. Will be an array of objects
      let nameOfArtist;
      let idOfArtist;
    //   console.log(response);
      response.forEach((element) => { //loop response array and obtain the artist and id to make a fetch request
        for (const [key, value] of Object.entries(element)) {
            if (key === 'id') {  
                idOfArtist = value;   //store name of artist
            } else if (key === 'name') {
                nameOfArtist = value;  //store artist id
                artistsAndId.push({"name": nameOfArtist, "id": idOfArtist});  //push artist to array
            }
          }
      });
    //   console.log(artistsAndId);
      return artistsAndId;
    }catch(error) {
        return error;
    }
};

//prompt the user to select a artist
const selectArtist = async artistsArr => {
    //create an inquirer checkbox prompt
    return inquirer.prompt([
        {
            type: 'checkbox',
            name: 'name',
            message: "Select an artist (only 1)",
            choices: artistsArr,
            validate: artist => {
                if (artist.length > 1 || artist.length == 0) {
                    return 'You must only choose 1 artist to fetch';
                } else {
                    return true;
                }
            }
        }
    ]);
};

const getArtistId = (artistName, artistAndId) => {
    let id;
    for (let i = 0; i < artistAndId.length; i++) {
        if (artistName === artistAndId[i].name) {
            id = artistAndId[i].id;
            break;
        }
    }
    return id;
};

const fetch = async (id) => {
    try {
        const response = await custom.fetchSearch(id);
        const artistObj = {}
        for (const [key, value] of Object.entries(response)) {
            if (key === 'external_urls') {
                artistObj.spotify = value.spotify;
            } else if (key === 'followers') {
                artistObj.followers = value.total;
            } else if (key === 'genres') {
                artistObj.genres = value;
            } else if (key === 'images') {
                artistObj.images = value;
            } else if (key === 'name') {
                artistObj.name = value;
            } else if(key === 'popularity') {
                artistObj.popularity = value;
            } else if (key === 'type') {
                artistObj.type = value;
            }
          }   
        return artistObj;
    }catch(err){
        console.log(err);
        return err;
    }
};

const about = (artistObj) => {
    console.log(`Artist Name: ${artistObj.name}\n`);
    console.log(`External URLS: ${artistObj.spotify}`)
    console.log(`Number of followers: ${artistObj.followers}\n`);
    console.log(`Type: ${artistObj.type}\n`);
    console.log(`Popularity: ${artistObj.popularity}\n`);
    // console.log(`Genres: ${artistObj.genres}\n`);
    // console.log(`Images: ${artistObj.images}`);
    console.log("Genres:");
    artistObj.genres.forEach((element, index) => {
        console.log(`${index + 1}: ${element}`);
    });
};



module.exports = {
    startProcess
}