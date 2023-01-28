const http = require('http');
const fs = require('fs');
const requests = require('requests');

const homeFile = fs.readFileSync("home.html", "utf8");
const replaceVal = (tempval,orgval) => {
    let temperature = tempval.replace("{%tempval%}", orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgval.main.temp_max);
    temperature = temperature.replace("{%location%}", orgval.name);
    temperature = temperature.replace("{%country%}", orgval.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgval.weather[0].main);
    return temperature;
};

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid=27118a301aee0d1be8daf8f26b386997')
            .on('data',  (chunk) => {
                const objData = JSON.parse(chunk);
                const arrayData = [objData];
                //console.log(arrayData[0].main.temp);
                const realTimeData = arrayData.map((val) => 
                    replaceVal(homeFile,val)
                ).join("");
                res.write(realTimeData);
                console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
            });
    }
});

server.listen(8000,"127.0.0.1");