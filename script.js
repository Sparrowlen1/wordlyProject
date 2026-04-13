const search = document.getElementById("searchB");
const searchInput = document.getElementById("searchI");
const resultSearch = document.querySelector(".resultsearch");
const favouriteList = document.querySelector(".favouritelist");

//lets do async await for fetching since the .then and .catch is a bit tricky

async function searchWord(){
    const word = searchInput.value.trim();

    if(word ===""){
        resultSearch.innerHTML = "<p> Howdy there, Please enter a word captain! </p>";
        return;
    }
    try{
        resultSearch.innerHTML = `<p> searching for "${word}"...</p>`;

        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();
        if(!response.ok){
            throw new Error("Hmm, howdy seems we cant find the meaning")
        }
        else{
            const worddata = data[0];
            const discovered = worddata.discovered.map(discover=>{
                const definitions= discover.discovered.map(def => `<li>${def.definition}</li>`).join("");
                return `<h3>${discover.partOfSpeech}</h3><ul>${definitions}</ul>`;
            }).join("");
            resultSearch.innerHTML = `<h2>${worddata.word}</h2>${discovered}`;
        }
    }catch(error){
        resultSearch.innerHTML = `<p>"${word}" not found captain,</p>`;
    }
}

search.addEventListener("click",(e)=>{
    e.preventDefault();
    searchWord();
});

searchInput.addEventListener("keypress",(e)=>{
    if(e.key === "Enter"){
        e.preventDefault();
        searchWord();
    }
});