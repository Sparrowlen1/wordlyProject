const search = document.getElementById("searchB");
const searchInput = document.getElementById("searchI");
const resultSearch = document.querySelector(".resultsearch");
const favouriteList = document.querySelector(".favouritelist");
const themechange = document.querySelector(".themechange");

let topWord = ""; //store word

let favour = JSON.parse(localStorage.getItem("favour")) || [];

let searchedword = JSON.parse(localStorage.getItem("lastSearchedWord")) || "";

if (searchedword && searchedword !== "") {
  searchInput.value = searchedword;
  setTimeout(() => {
    searchword();
  }, 100);
}
displayFavs();

// function to save favs to local storage using setitem
// function saveFavs(){
//     localStorage.setItem("favour", JSON.stringify(favour));
// }

// function to display favs

//lets do async await for fetching since the .then and .catch is a bit tricky

async function searchword() {
  const word = searchInput.value.trim();
  topword = word;
  localStorage.setItem("lastSearchedWord", JSON.stringify(word));
  if (word === "") {
    resultSearch.innerHTML =
      "<p> Howdy there, please enter a word my sparrow </p>";
    return;
  }
  try {
    resultSearch.innerHTML = `<p> searching for "${word}"...</p>`;

    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    const data = await response.json();

    if (data.title === "No Definitions Found") {
      throw new Error(
        "howdy my fellow sparrow, well cant find the meaning go back to school and learn some more words",
      );
    }

    const worddata = data[0];

    let audiourl = "";
    //free dic has phonetics array with audio url
    if (worddata.phonetics && worddata.phonetics.length > 0) {
      const phoneticwithAudio = worddata.phonetics.find(
        (phonetic) => phonetic.audio,
      );
      if (phoneticwithAudio) {
        audiourl = phoneticwithAudio.audio;
      }
    }

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

    resultSearch.innerHTML = `<h2>${worddata.word}</h2>${audiourl ? `<button id="pronounceButton" class="pronouncebtn"><i class="fa-solid fa-volume-high"></i> Pronounce</button>` : ""}${discovered}<button id="favouriteheart" ><i class="fa-regular fa-heart"></i> Add to favouritess</button>`;

    const pronounceButton = document.getElementById("pronounceButton");
    if (pronounceButton && audiourl) {
      pronounceButton.addEventListener("click", () => {
        playAudio(audiourl);
      });
    }
    const favouritebutton = document.getElementById("favouriteheart");
    if (favouritebutton) {
      favouritebutton.addEventListener("click", addtofavourites);
    }
  } catch (error) {
    console.log("Error:", error);
    resultSearch.innerHTML = `<p>"${word}" not found captain,</p>`;
  }
}

function playAudio(audiourl) {
  try {
    const audio = new Audio(audiourl); //constructs a new audio object with the provided URL
    // audio.preload = "auto";
    audio.play();//audio method
  } catch (error) {
    console.log("well unfortunately my cap audio cant be played:", error);
    alert("Sorry my fellow Sparrow, we are having trouble playing the audio");
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

function addtofavourites() {
  if (!topword || topword === "") {
    alert("Howdy there cap, please search for a word before adding to favourites");
    return;
  }
  if (favour.includes(topword)) {
    alert("well captain, find yourself a new favourite word aye aye captain");
    return;
  }
  favour.push(topword);
  // save to local storage after word has been pushed to the array
  localStorage.setItem("favour", JSON.stringify(favour));
  displayFavs();

  alert(`"${topword}" well Sparrow, your favs has been updatded`);
}

function displayFavs() {
  favouriteList.innerHTML = "";
  if (favour.length === 0) {
    favouriteList.innerHTML =
      "<p> howdy there captain, add somefavourites captain! </p>";
    return;
  }

  favour.forEach((word) => {
    const cont = document.createElement("div");
    const favItems = document.createElement("li");
    favItems.textContent = word;
    const delet = document.createElement("button");
    delet.textContent = "Delete";
    delet.classList.add("deletebutton");
    delet.addEventListener("click", (e) => {
      e.stopPropagation(); // prevents triggereingt the search when delete is clicked. well it will aso search it
      const index = favour.indexOf(word);//index of word and check if its above -1
      if (index !== -1) {
        favour.splice(index, 1); //deletes the word from the array
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

favouriteList.addEventListener("click", (e) => {
  let targetLi = e.target;
  if (targetLi.tagName !== "LI") {
    targetLi = targetLi.closest("li");
  }
  if (targetLi && targetLi.tagName === "LI") {
    searchInput.value = targetLi.textContent;
    searchword();
  }
});

//darmode
function toggletheme() {
  document.body.classList.toggle("darkmode");

  const moonicon = themechange.querySelector("i");
  const themetext = themechange.querySelector("p");

  if (document.body.classList.contains("darkmode")) {
    moonicon.className = "fa-regular fa-moon";
    themetext.textContent = "Dark Mode";
  } else {
    moonicon.className = "fa-regular fa-sun";
    themetext.textContent = "Light Mode";
  }
}
themechange.addEventListener("click", toggletheme);
