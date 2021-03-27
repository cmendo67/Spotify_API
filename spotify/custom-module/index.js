const config = require("./config.json");
const superagent = require("superagent");

const searchResults  = async (artist,type) => {
    const searchUrl = `${config.url}search?q=${artist}&type=${type}`;;
    console.log("search method:",searchUrl);
    
    let data;
        await superagent.get(searchUrl).set('Accept','application/json').set('Content-Type','application/json').set('Authorization',`Bearer ${config.token}`).then(message =>{
            data = message.body.artists.items;
        }).catch(error =>{
            console.log(error);
        });
    return data;
}

//creating a function for fetching
const fetchSearch = async artistId => {
    const fetchUrl = `${config.url}artists/${artistId}`; //url to make get request
    let data; //data to hold the JSON data

    //promise for search for artist and type
    await superagent.get(fetchUrl).set('Accept', 'application/json').set('Content-Type', 'application/json')
    .set('Authorization', `Bearer ${config.token2} `).then(mess => {
        // data = mess.body.artists.items; //assign JSON data to data 
        data = mess.body;
    }).catch(err => {
        console.log(err); //print err if theres an err
        return err;
    })
    return data;  
};

module.exports = {
    searchResults,
    fetchSearch
}