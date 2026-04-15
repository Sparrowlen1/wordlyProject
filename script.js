console.log("JavaScript is loaded and running!");

const search = document.getElementById("searchB");
const searchInput = document.getElementById("searchI");
const resultSearch = document.querySelector(".resultsearch");
const favouriteList = document.querySelector(".favouritelist");
const themechange = document.querySelector(".themechange");

// storing current(top) word for favourites
let topWord = "";

// loading favs from local storage using getitem
let favour = JSON.parse(localStorage.getItem("favour")) || [];


// function to save favs to local storage using setitem
// function saveFavs(){
//     localStorage.setItem("favour", JSON.stringify(favour));
// }

// function to display favs

//lets do async await for fetching since the .then and .catch is a bit tricky

async function searchword() {
  const word = searchInput.value.trim();
  topWord = word; //this uppdates the topword with word

  if (word === "") {
    resultSearch.innerHTML =
      "<p> Howdy there, Please enter a word captain! </p>";
    return;
  }
  try {
    resultSearch.innerHTML = `<p> searching for "${word}"...</p>`;

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    const data = await response.json();

    if (data.title === "No Definitions Found") {
      throw new Error("Hmm, howdy seems we cant find the meaning");
    }

    const worddata = data[0];

    const discovered = worddata.meanings
      .map((meaning) => {
        const definition = meaning.definitions
          .slice(0, 1)
          .map((def) => {
            let definitionText = `<li>${def.definition}</li>`;
            if (def.example) {
              definitionText += `<li class="example">Example: ${def.example}</li>`;
            }
            return definitionText;
          })
          .join("");
        return `<h3>${meaning.partOfSpeech}</h3><ul>${definition}</ul>`;
      })
      .join("");
    resultSearch.innerHTML = `<h2>${worddata.word}</h2>${discovered}<button id="favouriteheart" ><i class="fa-regular fa-heart"></i> Add to favouritess</button>`;

    // lets now add event listener to the favourite button using append
    const favouritebutton = document.getElementById("favouriteheart");
    if (favouritebutton) {
      favouritebutton.addEventListener("click", addtofavourites);   
    };
  } catch (error) {
    console.log("Error:", error);
    resultSearch.innerHTML = `<p>"${word}" not found captain,</p>`;
  }
}

search.addEventListener("click", (e) => {
  e.preventDefault();
  searchword();
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchword();
  }
});

// function to add current word to favour and save to local storage
function addtofavourites() {
  if (!topWord || topWord === "") {
    alert("Howdy there, Please search for a word before adding to favourites");
    return;
  }
  // checked if the word exists in local storage declared globaly as favour
  if (favour.includes(topWord)) {
    alert("well captain, find yourself a new favourite word");
    return;
  }
  // added the word to the favour array and save to local storage
  favour.push(topWord);
  // save to local storage
  localStorage.setItem("favour", JSON.stringify(favour));
  // display the updated favs list of the favour
  displayFavs();

  alert(`"${topWord}" has been added to your favourites!`);
}

// function to display favs in the favouritelist
function displayFavs() {
    // clear the current list before displaying updated favs
    favouriteList.innerHTML = "";

    if(favour.length === 0){
        favouriteList.innerHTML = "<p> howdy there captain, add somefavourites captain! </p>";
        return;
    }
  
  favour.forEach((word) => {
    const cont = document.createElement("div");
    const favItems = document.createElement("li");
    favItems.textContent = word;
    const delet = document.createElement("button");
    delet.textContent = "Delete from favs";
    delet.classList.add("delete-button");
    delet.addEventListener("click", (e) => {
        e.stopPropagation(); // prevents triggereingt the search when delete is clicked
        const index = favour.indexOf(word);
        if (index !== -1) {
            favour.splice(index, 1);
            localStorage.setItem("favour", JSON.stringify(favour));
            displayFavs();
            alert(`howdy"${word}" has been removed from your favourites`);
        }
    });
    cont.appendChild(favItems);
    favouriteList.appendChild(cont);
    cont.appendChild(delet);

  });
}

// lets now search the a fav word when clicked
favouriteList.addEventListener("click", (e) => {
    // check if list is a an li or just child of li
    let targetLi = e.target;
    if (targetLi.tagName !== "LI") {
        targetLi = targetLi.closest("li");
    }
    if (targetLi && targetLi.tagName === "LI") {
        searchInput.value = targetLi.textContent;
        searchword();
    }
});


// dark mode functionn
// used the classList methods such as toggle and contains
function toggletheme() {
  document.body.classList.toggle("darkmode");

  const moonicon = themechange.querySelector("i");
  const themetext = themechange.querySelector("p");

  if (document.body.classList.contains("dark-mode")) {
    moonicon.className = "fa-regular fa-moon";
    themetext.textContent = "Dark Mode";
  } else {
    moonicon.className = "fa-regular fa-sun";
    themetext.textContent = "Light Mode";
  }
}
themechange.addEventListener("click", toggletheme);
