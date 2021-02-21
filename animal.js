"use strict";

window.addEventListener("DOMContentLoaded", start);

let allAnimals = [];
console.log(allAnimals);

let filter;

// The prototype for all animals: 
const Animal = {
    name: "",
    desc: "-unknown animal-",
    type: "",
    age: 0
};

let buttons = document.querySelectorAll("button.filter");

function start() {
    console.log("ready");
    
    loadJSON();

    // TODO: Add event-listeners to filter and sort buttons
buttons.forEach((button) => {
    button.addEventListener("click", checkFilter);
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

    // append clone to list
    document.querySelector("#list tbody").appendChild(clone);
}

// eventlistenerforbutton

function checkFilter(event){

filter = event.target.dataset.filter;
console.log(filter);
const filteredAnimals = filterAnimals();
displayList(filteredAnimals);
}

function filterAnimals() {
    let filteredAnimals =[];
    switch(filter) {
        case "all":
            filteredAnimals = allAnimals.filter(isAll);
            break;
        case "cat":
            filteredAnimals = allAnimals.filter(isCat);
            break;
        case "dog":
            filteredAnimals = allAnimals.filter(isDog);
            break;
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
