"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "shobhit sugumar",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements------------------------------------------------------------------------------
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//Displaying data(movemets) function--------------------------------------------------------------
const displaydata = function (movements, sort = false) {
  containerMovements.innerHTML = " ";

  /*here initiali we set sort as false it become only true when button is clicked and here it check if the sort is false just it passes the movements argument to foreach e
  if it become true then it get sorted here slice is used to create a shallow copy of the array we dont want to afect the original array then we have done sorting to the 
  copied  array and we have passed to the forEach mehtod */

  const ascsort = sort ? movements.slice().sort((a, b) => a - b) : movements;

  ascsort.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `<div class="movements">
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

//calculating balance function------------------------------------------------------------------------
const caldisbalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

//calculating summary function------------------------------------------------------------------------
const caldissummary = function (acc) {
  //summary incoome
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income.toFixed(2)}€`;

  //summary outcome
  const outcome = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome).toFixed(2)}€`;

  //summary interest
  const interest = acc.movements
    .filter((int) => int > 0)
    .map((dep) => (dep * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

//creating username (eg ss)---------------------------------------------------------------------------
const creatusername = function (accs) {
  accs.forEach(function (acc) {
    acc.user = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

creatusername(accounts);

// FUNCTION TO DISPLAY UI------------------------------------------------------------------------------
const updateUI = function (acc) {
  //Display movements
  displaydata(acc.movements);

  //Display balance
  caldisbalance(acc);

  //Display summary
  caldissummary(acc);
};

//EVENT HANDLER for login button-------------------------------------------------------------------------

let currentaccount;

btnLogin.addEventListener("click", function (e) {
  //preventDefault
  e.preventDefault();

  //const accounts = [account1, account2, account3, account4];
  currentaccount = accounts.find(
    (acc) => acc.user === inputLoginUsername.value
  );

  if (currentaccount?.pin === Number(inputLoginPin.value)) {
    //Display welcome and UI
    labelWelcome.textContent = `Welcome ${currentaccount.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;

    //clearing input fields
    inputLoginUsername.value = "";
    inputLoginPin.value = "";

    //calling the UI function
    updateUI(currentaccount);
  }
});

//EVENT HANDLER FOR TRANSFER BUTTON---------------------------------------------------------------------------

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);

  //const accounts = [account1, account2, account3, account4];
  const recieverAcc = accounts.find(
    (acc) => acc.user === inputTransferTo.value
  );
  //cleaning the inputfields
  inputTransferTo.value = "";
  inputTransferAmount.value = "";

  if (
    amount > 0 &&
    recieverAcc &&
    currentaccount.balance >= amount &&
    recieverAcc?.user !== currentaccount.user
  ) {
    //DOING THE TRANSFER

    currentaccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    console.log(currentaccount);
    // calling the UI function
    updateUI(currentaccount);
  }
});

//Event handler for loan --------------------------------------------------------------------------------------------

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentaccount.movements.some(
      (mov) => mov >= /*greater than or equal */ amount * 0.1
    )
  ) {
    currentaccount.movements.push(amount);

    //update the UI
    updateUI(currentaccount);
  } else {
    alert("your not eligible for the loan ");
  }
  //clear the input fields
  inputLoanAmount.value = "";
});

//EVENT HANDLER FOR CLOSE ACCOUNT

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentaccount.user &&
    Number(inputClosePin.value) === currentaccount.pin
  ) {
    const index = accounts.findIndex((acc) => acc.user === currentaccount.user);

    //delete account
    accounts.splice(index, 1);

    //hiding UI
    containerApp.style.opacity = 0;
  }
  //clearing the input fields
  inputClosePin.value = "";
  inputCloseUsername.value = "";
});

//event handler for sort --------------------------------------------
let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displaydata(currentaccount.movements, !sorted);
  sorted = !sorted;
});

///////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
///////////////////////////////////////////////////
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/*const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];*/

/////////////////////////////////////////////////
/*const checkdogs = function (dogjulia, dogkate) {
  const dogcorrected = dogjulia.slice();
  dogcorrected.splice(0, 1);
  dogcorrected.splice(-2);
  const final = dogcorrected.concat(dogkate);
  final.forEach(function (dog, i) {
    if (dog >= 3) {
      console.log(`${i} ${dog} is greater than 3 years`);
    } else {
      console.log(`${i} ${dog} is less than 3 years`);
    }
  });
};
checkdogs([3, 5, 2, 7, 12], [4, 1, 15, 8, 3]);
*/
/*const arr = [1, 2, 3, 4, 5, 6];
const trying = arr.map(function (mov) {
  return mov * 2;
});
console.log(trying);

const atry = arr.map((mov) => mov * 3);
console.log(atry);

const withdrawal = movements.filter((mov) => mov < 0);

console.log(withdrawal);*/

/*const calaverageHumanAge = function (dogage) {
  const humanage = dogage
    .map((dage) => (dage <= 2 ? 2 * dage : 16 + dage * 4))
    .filter((age) => age >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

  return humanage;
};
console.log(calaverageHumanAge([5, 2, 4, 1, 15, 8, 3]));*/
/*
const account = function (acc) {
  for (const [index, i] of acc.entries()) {
    if (i.owner === "Jessica Davis") {
      console.log(acc[index]);
    }
  }
};
account(accounts);*/
/*
const randomarr = Array.from({ length: 100 }, () =>
  Math.trunc(Math.random() * 100)
);
const zerofnd = randomarr.filter((mov, i) => mov === 0);
console.log(zerofnd);
console.log(randomarr);
console.log(randomarr.length);

const conversion = function (title) {
  const exception = ["a", "an", "the", "but", "or", "on", "in", "with"];
  const tittlecase = title
    .toLowerCase()
    .split(" ")
    .map((word) =>
      exception.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(" ");
  return tittlecase;
};
console.log(conversion("this is a nice title"));
console.log(conversion("this is a LONG tittle but not that much long"));





Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:*/
const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];
const weightgreat = dogs
  .filter((weight) => weight.weight > 10)
  .sort((a, b) => a.weight - b.weight);
console.log(weightgreat);

/*
dogs.forEach((dogs) =>
  Math.trunc((dogs.recommendedFood = Math.trunc(dogs.weight ** 0.75 * 28)))
);
console.log(dogs);

const findsara = dogs.find((dog) => dog.owners.includes("Sarah"));
console.log(
  findsara.curFood > findsara.recommendedFood
    ? "this dog eat a lot "
    : "eats correctly"
);

const ownersshigh = dogs
  .filter((owner) => owner.curFood > owner.recommendedFood)
  .flatMap((owner) => owner.owners);

const ownersslittle = dogs
  .filter((owner) => owner.curFood < owner.recommendedFood)
  .flatMap((owner) => owner.owners);

console.log(`${ownersshigh.join(" and ")} dogs eats toomuch`);
console.log(`${ownersslittle.join(" and ")} dogs eats little`);

const ecaxtly = dogs.some((dog) => dog.curFood === dog.recommendedFood);
console.log(ecaxtly);

const sort = dogs.slice().sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(sort);
*/
const dateee = new Date();
console.log(dateee);
