console.log("JavaScript is loaded and running!");

const search = document.getElementById("searchB");
const searchInput = document.getElementById("searchI");
const resultSearch = document.querySelector(".resultsearch");
const favouriteList = document.querySelector(".favouritelist");
const themechange = document.querySelector(".themechange");

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
        
        if(data.title === "No Definitions Found"){
            throw new Error("Hmm, howdy seems we cant find the meaning")
        }
        
        const worddata = data[0];
        
        const discovered = worddata.meanings.map(meaning=>{
            const definition = meaning.definitions.slice(0,1).map(def => {
                let definitionText = `<li>${def.definition}</li>`;
                if(def.example){
                    definitionText += `<li class="example">Example: ${def.example}</li>`;
                }
                return definitionText;
            }).join("");
            return `<h3>${meaning.partOfSpeech}</h3><ul>${definition}</ul>`;
        }).join("");
        resultSearch.innerHTML = `<h2>${worddata.word}</h2>${discovered}`;
        
    }catch(error){
        console.log("Error:", error);
        resultSearch.innerHTML = `<p>"${word}" not found captain,</p>`;
    }
}

search.addEventListener("click", (e) => {
  e.preventDefault();
  searchWord();
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchWord();
  }
});


// dark mode functionn
function toggletheme(){
    document.body.classList.toggle("dark-mode");

    const moonicon = themechange.querySelector("i");
    const themetext = themechange.querySelector("p");

    if(document.body.classList.contains("dark-mode")){
        moonicon.className = "fa-regular fa-moon";
        themetext.textContent = "Dark Mode";
    } else {
        moonicon.className = "fa-regular fa-sun";
        themetext.textContent = "Light Mode";
    }
}
themechange.addEventListener("click", toggletheme)