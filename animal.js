"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];

const settings = {
 filterBy: "all",
 sortBy: "all",
 sortDir: "",
}

// The prototype for all animals: 
const Animal = {
    star: false,
    winner: false,
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0,
};

let buttons = document.querySelectorAll("button.filter");
let listItems = document.querySelectorAll("[data-action=sort]");
let starButton = document.querySelectorAll("[data-field=star]");

function start() {
    console.log("ready");
    
    loadJSON();

    // TODO: Add event-listeners to filter and sort buttons
buttons.forEach((button) => {
    button.addEventListener("click", checkFilter);
    });

    listItems.forEach((listItem) => {
        listItem.addEventListener("click", checkSort);
    });

}

async function loadJSON() {
    const response = await fetch("animal.json");
    const jsonData = await response.json();
    
    // when loaded, prepare data objects
    prepareObjects(jsonData);
}

function prepareObjects(jsonData) {
    allAnimals = jsonData.map(preapareObject);

    // TODO: This might not be the function we want to call first
    
    displayList(allAnimals);
}

function preapareObject(jsonObject) {
    const animal = Object.create(Animal);
    
    const texts = jsonObject.fullname.split(" ");

    animal.name = texts[0];
    animal.desc = texts[2];
    animal.type = texts[3];
    animal.age = jsonObject.age;
    animal.star = true;

    return animal;
}

function displayList(animals) {
    // clear the list
    document.querySelector("#list tbody").innerHTML = "";

    // build a new list
    animals.forEach(displayAnimal);
}

function displayAnimal(animal) {
    // create clone
    const clone = document.querySelector("template#animal").content.cloneNode(true);

    // set clone data
    clone.querySelector("[data-field=name]").textContent = animal.name;
    clone.querySelector("[data-field=desc]").textContent = animal.desc;
    clone.querySelector("[data-field=type]").textContent = animal.type;
    clone.querySelector("[data-field=age]").textContent = animal.age;

    //USE CLOSURE TO ADD EVENT LISTENER TO STAR
    clone.querySelector("[data-field=star]").addEventListener("click", starClicked);

    if (animal.star == true) {
        clone.querySelector("[data-field=star]").textContent = "⭐";
    }
    else {
        clone.querySelector("[data-field=star]").textContent = "☆";
    }

    function starClicked() {
        console.log("star clicked");
        if (animal.star == true) {
            animal.star = false; 
        }
        else {
            animal.star = true;
        }
    
        buildList();
    }

    //WINNERS
        clone.querySelector("[data-field=winner]").dataset.winner = animal.winner;
        clone.querySelector("[data-field=winner]").addEventListener("click", clickWinner);

    function clickWinner(){
        if (animal.winner == true) {
            animal.winner = false; 
        }
        else {
            tryToMakeAWinner(animal);
        }
        buildList();
    }

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}

function tryToMakeAWinner(selectedAnimal){

    const winners = allAnimals.filter(animal => animal.winner);
    const numberOfWinners = winners.length;
    const other = winners.filter(animal => animal.type === selectedAnimal.type).shift();

    //if there is another of the same type
    if (other !== undefined){
        console.log("there can only be one");
        removeOther(other);
    //if there is more than 2
    } else if(numberOfWinners >= 2){
        console.log("there can only be 2 winners");
        removeAorB(winners[0], winners[1]);
    } else {
        makeWinner(selectedAnimal);
    }

    //for testing 

    function removeOther(other){
        //ask the user to ignore or remove other
        document.querySelector("#remove_other").classList.remove("hide");
        document.querySelector("#remove_other #removeother").innerHTML = `remove ${other.name}`;
        document.querySelector("#remove_other .closebutton").addEventListener("click", closeDialog);
        document.querySelector("#remove_other #removeother").addEventListener("click", clickRemoveOther);

        //if ignore
        function closeDialog(){
        document.querySelector("#remove_other").classList.add("hide");
        document.querySelector("#remove_other .closebutton").removeEventListener("click", closeDialog);
        document.querySelector("#remove_other #removeother").removeEventListener("click", clickRemoveOther);
        }

        //if remove other:
        function clickRemoveOther(){
        removeWinner(other);
        makeWinner(selectedAnimal);
        buildList();
        closeDialog();
        }

    }

function removeAorB(winnerA, winnerB){
    //ask user to ignore, or remove A or B
    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb #removea").innerHTML = `remove ${winnerA.name}`;
    document.querySelector("#remove_aorb #removeb").innerHTML = `remove ${winnerB.name}`;
    document.querySelector("#remove_aorb .closebutton").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #removea").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #removeb").addEventListener("click", clickRemoveB);

    //if ignore - do nothing 
    function closeDialog() {
        document.querySelector("#remove_aorb").classList.add("hide");
        document.querySelector("#remove_aorb .closebutton").removeEventListener("click", closeDialog);
        document.querySelector("#remove_aorb #removea").removeEventListener("click", clickRemoveA);
        document.querySelector("#remove_aorb #removeb").removeEventListener("click", clickRemoveB);
    }

    //if remove A;
    function clickRemoveA(){
    console.log(winnerA);
    removeWinner(winnerA);
    makeWinner(selectedAnimal);
    buildList();
    closeDialog();
    }

    //if remove B: 
    function clickRemoveB(){
        removeWinner(winnerB);
        makeWinner(selectedAnimal);
        buildList();
        closeDialog();
    }
}

function removeWinner(winnerAnimal){
        winnerAnimal.winner = false;
}

function makeWinner(animal){
        animal.winner = true;
}

}


function checkFilter(event){

const filter = event.target.dataset.filter;
console.log(filter);
setFilter(filter); 

}

function setFilter(filter){
    settings.filterBy = filter;
    buildList();
}

function filterAnimals(filteredAnimals) {
 if (settings.filterBy === "cat") {
    filteredAnimals = allAnimals.filter(isCat);
 }

 if (settings.filterBy === "dog") {
     filteredAnimals = allAnimals.filter(isDog);
 }

 if (settings.filterBy === "all") {
    filteredAnimals = allAnimals.filter(isAll);
}

    return filteredAnimals;
}

function isCat(animal){
    if(animal.type === "cat") {
    return true;
    } 
    else{
        return false;
    }
}

function isDog(animal){
    if(animal.type === "dog") {
    return true;
    } 
    else{
        return false;
    }
}

function isAll(animal){
    return true;
}

function checkSort(event){
    const sortBy = event.target.dataset.sort;
    const sortDir = event.target.dataset.sortDirection
    //find old sortby element 
    //const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
    //oldElement.classList.remove("sortBy");

    ////indicate active sort
    //event.target.classList.add("sortBy");
    //toggle direction 
    if(settings.sortDir === "asc"){
        event.target.dataset.sortDirection = "desc";
    } else {
        event.target.dataset.sortDirection = "asc";
    }

    console.log(settings.sortDir);
    setSort(sortBy, sortDir);
    }

function setSort(sortBy, sortDir){
    settings.sortBy = sortBy;
    settings.sortDir = sortDir;
    buildList();
    }

function sortList(sortedList){

    let direction = 1;
    if(settings.sortDir === "desc") {
        direction = -1;
    } else {
        direction = 1;
    }

    sortedList = sortedList.sort(sortBySort);  
    
    function sortBySort(animalA, animalB) {
        if(animalA[settings.sortBy] < animalB[settings.sortBy]) {
            return -1 * direction;
            }
            else {
                return 1 * direction;
            }
        }

    return sortedList;
}

function buildList() {
    //sort list by currently selected sorting
    const currentList = filterAnimals(allAnimals);
    //filter the sorted list by current 
    const sortedList = sortList(currentList);
    //display filtered list
    displayList(sortedList);
}
