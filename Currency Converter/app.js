// ✅ Base URL for Frankfurter API
const BASE_URL = "https://api.frankfurter.app/latest";

// ✅ Mapping of currency codes → country codes for flags
const countryList = {
  USD: "US", // United States Dollar
  INR: "IN", // Indian Rupee
  EUR: "EU", // Euro
  GBP: "GB", // British Pound
  AUD: "AU", // Australian Dollar
  CAD: "CA", // Canadian Dollar
  JPY: "JP", // Japanese Yen
  CNY: "CN", // Chinese Yuan
  NZD: "NZ", // New Zealand Dollar
  CHF: "CH", // Swiss Franc
  SEK: "SE", // Swedish Krona
  NOK: "NO", // Norwegian Krone
  DKK: "DK", // Danish Krone
  RUB: "RU", // Russian Ruble
  BRL: "BR", // Brazilian Real
  ZAR: "ZA", // South African Rand
  MXN: "MX", // Mexican Peso
  SGD: "SG", // Singapore Dollar
  HKD: "HK", // Hong Kong Dollar
  KRW: "KR", // South Korean Won
  AED: "AE", // UAE Dirham
  SAR: "SA", // Saudi Riyal
  TRY: "TR", // Turkish Lira
};

// ✅ DOM Elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// ✅ Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    if (select.name === "from" && currCode === "USD") {
      option.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      option.selected = true;
    }

    select.append(option);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// ✅ Update exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const from = fromCurr.value;
  const to = toCurr.value;

  // Same currency → no conversion needed
  if (from === to) {
    msg.innerText = `${amtVal} ${from} = ${amtVal} ${to}`;
    return;
  }

  const URL = `${BASE_URL}?amount=${amtVal}&from=${from}&to=${to}`;

  try {
    let response = await fetch(URL);
    let data = await response.json();

    let rate = data.rates[to];
    let finalAmount = rate.toFixed(2);

    msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rate.";
    console.error("Error:", error);
  }
};

// ✅ Update flag
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// ✅ Event listeners
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
