/////////////////////////////declare variables/////////////////////////////

const sidebarBg = document.getElementById("sidebar-bg");
const sidebarText = document.querySelectorAll("[id='menu-text']");
const sidebarIcon = document.getElementsByClassName("fa-solid fa-bars");
const sidebarX = document.getElementsByClassName("fa-solid fa-xmark");
const topLogo = document.getElementById("top-logo");
const topLogo2 = document.getElementById("top-logo2");
const carouselShadow = document.getElementById("shg");
const langSel = Array.from(document.querySelectorAll("[class='selectionLang']"));
const langIco = Array.from(document.querySelectorAll("[id='lang-ico']"));
const themeSel = $('#themeButtons');

const button = Array.from(document.querySelectorAll("[data-theme-toggle]"));
const sun = Array.from(document.querySelectorAll("[class='fa-solid fa-sun']"));
const moon = Array.from(document.querySelectorAll("[class='fa-solid fa-moon']"));
const localStorageTheme = localStorage.getItem("theme");
const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
let currentThemeSetting = calculateSettingAsThemeString({ localStorageTheme, systemSettingDark });

const selectLang = Array.from(document.querySelectorAll("[data-lang-toggle]"));
const selection = Array.from(document.querySelectorAll("[id='inputselect']"));
const localStorageLang = localStorage.getItem("lang");
let currentLangSetting = calculateSettingAsLangString({ localStorageLang });
let translations = {}
let locale;



/////////////////////////////create functions/////////////////////////////

function onPageLoad() {
  for (let i = 0; i < selectLang.length; i++) {
    selectLang[i].value = localStorage.getItem("lang");
  }
}

function calculateSettingAsThemeString({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) {
    return localStorageTheme;
  }

  if (systemSettingDark.matches) {
    return "dark";
  }

  return "light";
}

function updateThemeOnHtmlEl({ theme }) {
  document.querySelector("html").setAttribute("data-theme", theme);
}

function calculateSettingAsLangString({ localStorageLang }) {
  if (localStorageLang !== null) {
    return localStorageLang;
  }

  return "en";
}

function updateLangOnHtmlEl({ lang }) {
  document.querySelector("html").setAttribute("lang", lang);
}

function calculateWidth() {
  let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  let mathWidth = 200 + 200/(1 + 2**(-0.03*(vw - 500)));
  let calcWidth = mathWidth - 0.12*vw - 10;
  return calcWidth;
}

function openSidebar() {
  sidebarBg.style.width = calculateWidth() + "px";
  sidebarBg.style.padding = "calc(var(--topnav-h) + 60px + 20px) calc(6vw + 10px) 0 6vw";

  sidebarIcon[0].style.transform = "scale(0)";
  sidebarIcon[0].style.opacity = "0";

  sidebarX[0].style.transform = "scale(1)";
  sidebarX[0].style.opacity = "1";

  topLogo.style.marginRight = "calc(3vw - 135px)";
  topLogo.style.clipPath = "inset(0 70% 0 0)";
  topLogo.style.opacity = "0";

  topLogo2.style.marginRight = "3vw";
  topLogo2.style.opacity = "1";

  langSel[0].style.opacity = "1";
  themeSel[0].style.opacity = "1";    

  for (let i = 0; i < sidebarText.length; i++) {
    sidebarText[i].style.color = "var(--light-box-col)";
  }

  carouselShadow.classList.remove("side-hover-group");
  addEventListener("resize", (event) => {
    sidebarBg.style.width = calculateWidth() + "px";
  });
}

function closeSidebar() {
  sidebarBg.style.width = "0";
  sidebarBg.style.padding = "calc(var(--topnav-h) + 60px + 20px) 0px";

  sidebarIcon[0].style.transform = "scale(1)";
  sidebarIcon[0].style.opacity = "1",

  sidebarX[0].style.transform = "scale(0)";
  sidebarX[0].style.opacity = "0";

  topLogo.style.marginRight = "3vw";
  topLogo.style.clipPath = "inset(0 0 0 0)";
  topLogo.style.opacity = "1";

  topLogo2.style.marginRight = "calc(3vw + 135px)";
  topLogo2.style.opacity = "0";

  langSel[0].style.opacity = "0";
  themeSel[0].style.opacity = "0";

  for (let i = 0; i < sidebarText.length; i++) {
    sidebarText[i].style.color = "transparent";
  }
}

function pointer(event) {
  let wdth = document.getElementById('menu-bar').offsetWidth;
  let wdth2 = document.getElementById('sidebar-bg').offsetWidth;
  let hght = document.getElementById('menu-bar').offsetHeight;

  if ((event.clientX > wdth || event.clientY > hght) && wdth2 < 1) {
    carouselShadow.classList.add("side-hover-group");
  }
}

function selectStyleOpen() {
  for (let i = 0; i < selection.length; i++) {
    selection[i].size= $('#inputselect option').length;

    selection[i].style.width= "auto";
    selection[i].style.height= "86px";
    selection[i].style.padding= "0 12px 0 0";
    selection[i].style.outline= "1px solid var(--light-box-col)";
  }
  for (let i = 0; i < langIco.length; i++) {
    langIco[i].style.marginTop= "-55px";
    langIco[i].style.marginRight= "-1px";
  }
}

function selectStyleClose() {
  for (let i = 0; i < selection.length; i++) {
    selection[i].size=1;

    selection[i].style.width= "auto";
    selection[i].style.height= "2em";
    selection[i].style.padding= "0";
    selection[i].style.outline= "none";
  }
  for (let i = 0; i < langIco.length; i++) {
    langIco[i].style.marginTop= "0";
    langIco[i].style.marginRight= "0";
  }
}

async function fetchTranslationsFor(newLocale) {
  const response = await fetch(`/star%20electornic/lang/${newLocale}.json`);
  return await response.json();
}
async function setLocale(newLocale) {
  if (newLocale === locale) return;
  const newTranslations =
    await fetchTranslationsFor(newLocale);
  locale = newLocale;
  translations = newTranslations;
  translatePage();
}
function translatePage() {
  document.querySelectorAll("[data-i18n-key]").forEach(translateElement);
}
function translateElement(element) {
  const key = element.getAttribute("data-i18n-key");
  const translation = translations[key];
  element.innerText = translation;
}



/////////////////////////////run scripts/////////////////////////////

setLocale(currentLangSetting);

updateThemeOnHtmlEl({ theme: currentThemeSetting });
updateLangOnHtmlEl({ lang: currentLangSetting });



/////////////////////////////add event listeners/////////////////////////////

for (let i = 0; i < selectLang.length; i++) {
  selectLang[i].addEventListener("change", (event) => {
    const newLang = selectLang[i].value;

    localStorage.setItem("lang", newLang);
    updateLangOnHtmlEl({ lang: newLang });

    currentLangSetting = newLang;
    setLocale(currentLangSetting);
  });
}

for (let k = 0; k < button.length; k++) {
  button[k].addEventListener("click", (event) => {
    const newTheme = currentThemeSetting === "dark" ? "light" : "dark";

    localStorage.setItem("theme", newTheme);
    updateThemeOnHtmlEl({ theme: newTheme });

    currentThemeSetting = newTheme;

    for (let i = 0; i < moon.length; i++) {
      if (newTheme === "dark") {
        moon[i].style.display = "none";
        sun[i].style.display = "inline-block";
      } else {
        moon[i].style.display = "inline-block";
        sun[i].style.display = "none";
      }
    }
  });
}

for (let i = 0; i < selection.length; i++) {
  $(selection[i]).mouseover(function(event){
            selectStyleOpen()
  });
            
  $(selection[i]).mouseout(function(event){
            selectStyleClose()
  });
}

for (let i = 0; i < langIco.length; i++) {
  $(langIco[i]).mouseover(function(event) {
      selectStyleOpen();
  });

  $(langIco[i]).mouseout(function(event) {
      selectStyleClose();
  });
}

document.addEventListener("mousemove", (event) => { pointer(event) });