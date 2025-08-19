const tempfeild = document.getElementById("temp");
const actualfeild = document.getElementById("feel");
const maxtempfeild = document.getElementById("tempMax");
const mintempfeild = document.getElementById("tempMin");
const tempIcon = document.getElementById("tempIcon")

const weatherfeild = document.getElementById("weather");
const descfeild = document.getElementById("description");
const cityfield = document.getElementById("location");
const cloudfield = document.getElementById("cloudcover");
const visiblityfeild = document.getElementById("visiblity");
const weathericonfeild = document.getElementById("weathericon");

const humidityfeild = document.getElementById("humidity");

const windspeedfeild = document.getElementById("windspeed");
const winddirectfeild = document.getElementById("winddirect");
const windfeelsfeild = document.getElementById("windfeels");
const windspeedinkm = document.getElementById("windspeedkm");
const windarrow = document.getElementById("windarrow");

const sunrisefeild = document.getElementById("sunrisetime");
const sunsetfeild = document.getElementById("sunsettime");
const currenttimefield = document.getElementById("time");
const datefeild = document.getElementById("date");
const sunangle = document.querySelector(".sundiv")

function fatchdata() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchcity},&appid=2cde6a9d5bf17f45d8aadb754225b2d9`)
    .then((response) => {return response.json()})
    .then((data) => {
            let temperature = (data.main.temp-273.15).toFixed(1);
            let feelslike = (data.main.feels_like-273.15).toFixed(1);
            let maxtemp = (data.main.temp_max-273.15).toFixed(1);
            let mintemp = (data.main.temp_min-273.15).toFixed(1);
            updateTemperature(temperature,feelslike,maxtemp,mintemp);
            return data ;
    })
    .then((data) => {
            const weather = (data.weather[0].main)
            const description = data.weather[0].description.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1))
                //here we make upper case our description
                .join(" ");
            const cityname = data.name
            const cloudcover = `${data.clouds.all}%`
            const visibility = (data.visibility/1000).toFixed(0)
            const icon = data.weather[0].icon
            updateWeather(weather,description,cityname,cloudcover,visibility,icon);
            return data ;
    })
    .then((data) => {
            const humidity = `${data.main.humidity}%`
            updatehumidity(humidity)
            return data ;
    })
    .then((data) => {
            const windspeed = data.wind.speed
            const winddeg = data.wind.deg
            let winddirection;
            let feels;


            if (winddeg>=355 || winddeg<=5){
                winddirection = "N";
            }else if (winddeg >= 6 && winddeg<=84 ) {
                winddirection = "NE";
            }else if (winddeg >=85 && winddeg <= 95){
                winddirection = "E";
            }else if (winddeg >=96 && winddeg <= 174){
                winddirection = "ES";
            }else if (winddeg >=175 && winddeg <= 185){
                winddirection = "S";
            }else if (winddeg >=186 && winddeg <= 264){
                winddirection = "SW";
            }else if (winddeg >=265 && winddeg <= 275){
                winddirection = "W";
            }else if (winddeg >=276 && winddeg <= 354){
                winddirection = "NW";
            }else return;

            if (windspeed <= 1.0){
                feels = 'Calm'
            }else if (windspeed <= 2.0 ){
                feels = 'Light Air'
            }else if (windspeed <= 5.0 ){
                feels = 'Light Breeze'
            }else if (windspeed <= 10.0 ){
                feels = 'Gentle Breeze'
            }else if (windspeed <= 15 ){
                feels = 'Moderate Breeze'
            }else if (windspeed <= 20 ){
                feels = 'Strong Breeze'
            }else if (windspeed <= 25 ){
                feels = 'Near Gale'
            }else if (windspeed <= 30 ){
                feels = 'Gale'
            }else if (windspeed >= 31 ){
                feels = 'Storm / Hurricane'
            }else return ;

        updatewind(windspeed,winddeg,winddirection,feels)
        return data

    })
    .then((data) => {

        timezoneInterval = setInterval(() => {getTime(data)},1000)









    })
    .catch((error) => {console.log(`error is ${error}`)})
}

function updateTemperature(temperature,feelslike,maxtemp,mintemp) {
        tempfeild.innerHTML = temperature;
        actualfeild.innerHTML = feelslike;
        maxtempfeild.innerHTML = maxtemp;
        mintempfeild.innerHTML = mintemp;
       if(temperature > 26){
               tempIcon.src = "./Assets/tempwarm.svg"
       }else {
               tempIcon.src = "./Assets/tempcool.svg"
       }
}

function updateWeather(weather,description,cityname,cloudcover,visibility,icon) {
        weatherfeild.innerHTML = weather;
        descfeild.innerHTML = description;
        cityfield.innerHTML = cityname;
        cloudfield.innerHTML = cloudcover
        visiblityfeild.innerHTML = `${visibility} Km`
        weathericonfeild.src = `./Assets/weathericons/${icon}.svg`
}

function updatehumidity(humidity) {
    humidityfeild.innerHTML = humidity;
}
function updatewind(windspeed,winddeg,winddirection,feels) {
    windspeedfeild.innerHTML = `${windspeed}/ms`;
    winddirectfeild.innerHTML = `${winddirection} (${winddeg}°)`;
    windfeelsfeild.innerHTML = feels;
    windspeedinkm.innerHTML = (windspeed * 3.6).toFixed(1)
    windarrow.style.transform = `rotate(${winddeg}deg)`


}


function getTime(data){
    const currentutc = Date.now()
    const citydate = new Date(currentutc+data.timezone*1000)

    let hour = citydate.getUTCHours()
    let minute = citydate.getUTCMinutes()
    let ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    minute = minute < 10 ? '0' + minute : minute;
    const currenttime = `${hour.toString().padStart(2,'0')}:${minute} ${ampm}`;

    //cuurent date
    const monthname = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const crweekday = weekday[citydate.getDay()];
    const crdate = citydate.getUTCDate().toString().padStart(2,'0');
    const crmonth = monthname[citydate.getMonth()];
    const cryear = citydate.getFullYear().toString();

    const Datenow = `${crweekday} ${crdate}-${crmonth}-${cryear}`


    //current sunrise and sunset
    const timezoneOffset = data.timezone * 1000; // milliseconds
    const sunriseUTC = new Date(data.sys.sunrise * 1000);
    const sunsetUTC = new Date(data.sys.sunset * 1000);

    // Convert to city's local time by adding offset
    const sunriseLocal = new Date(sunriseUTC.getTime() + timezoneOffset);
    const sunsetLocal = new Date(sunsetUTC.getTime() + timezoneOffset);

    function formatAMPM(date) {
        let hours = date.getUTCHours();
        let minutes = date.getUTCMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    }

    const Sunrise = formatAMPM(sunriseLocal);
    const Sunset = formatAMPM(sunsetLocal);

    function getSunAngle(data) {
        const sunrise = data.sys.sunrise; // seconds
        const sunset = data.sys.sunset;   // seconds
        const now = Date.now() / 1000;    // current time in seconds (float for smoothness)

        const dayStartAngle = -3;
        const dayEndAngle = 177;
        const nightAngle = -90; // fixed angle for night

        let angle; // <-- yahi pe value aayegi

        if (now >= sunrise && now <= sunset) {
            // Din ka time → interpolate angle
            const dayDuration = sunset - sunrise;
            const elapsed = now - sunrise;
            const progress = elapsed / dayDuration; // 0 → 1
            angle = dayStartAngle + progress * (dayEndAngle - dayStartAngle);
        } else {
            // Raat me → fix angle
            angle = nightAngle;
        }

        return angle; // <-- yeh final angle hoga
    }

    const finalangle = getSunAngle(data)
    updatetime(currenttime,Sunrise,Sunset,Datenow,finalangle)
    console.log(getSunAngle(data))
}
function updatetime(currenttime,Sunrise,Sunset,Datenow,finalangle) {
    currenttimefield.innerHTML = currenttime;
    datefeild.innerHTML = Datenow;
    sunrisefeild.innerHTML = Sunrise;
    sunsetfeild.innerHTML = Sunset;
    sunangle.style.transform = `translateY(50%) translateX(-50%) rotate(${finalangle}deg)`;


}


let timezoneInterval;
let inputvalue;
const submitbtn = document.querySelector("#searchBtn");
let searchcity = "Jaipur";
fatchdata();
submitbtn.addEventListener("click",(e) => {
    e.preventDefault()
    console.log(e.target)
    inputvalue = document.querySelector("#inputcity").value;
    searchcity = inputvalue;
    clearInterval(timezoneInterval)
    fatchdata();
})


