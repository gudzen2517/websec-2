const express = require('express'); 
const axios = require('axios');
const cheerio = require('cheerio');

const app = express(); 
const port = process.env.PORT || 3001; 

const default_url = 'https://ssau.ru/rasp?staffId=364272302&selectedWeek=16&selectedWeekday=1'; 
let url = '';
let flag = false;

app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/processing_link', async (req, res) => 
{ 
  try 
  { 
    flag = false;
    url = '';
    console.log(req);
    if(req.query.param)
    {
      url = req.query.param;
      flag = true;
      if(req.query.selectedWeek)
      {
        url = url + '&selectedWeek=' + req.query.selectedWeek + '&selectedWeekday=' + req.query.selectedWeekday;
      }
    }
  } 
  catch (error) 
  {
    console.error('Error parsing website:', error);
    res.status(500).json({ error: 'Error parsing website' });
  }
}); 


app.get('/get_schedule', async (req, res) => 
{ 
  try 
  { 
    let response;
    if(flag === false) 
      response = await axios.get(default_url);
    else
      response = await axios.get(url);

    const html = response.data;

    const $ = cheerio.load(html);
    
    const datas = {};

    const data = $('body > div.container.timetable > div.card-default.timetable-card > div.schedule > div.schedule__items > div.schedule__item').each((i, elem) => {
      datas[i] = $(elem).text();
    })    

    res.json(JSON.stringify(datas))
  } 
  catch (error) 
  {
    console.error('Error parsing website:', error);
    res.status(500).json({ error: 'Error parsing website' });
  }
}); 

app.get('/get_time', async (req, res) => 
{ 
  try 
  {
    let response;
    if(flag === false) 
      response = await axios.get(default_url);
    else
      response = await axios.get(url);

    const html = response.data;

    const $ = cheerio.load(html);
    
    const times = {};

    const time = $('body > div.container.timetable > div.card-default.timetable-card > div.schedule > div.schedule__items > div.schedule__time').each((i, elem) => {
      times[i] = $(elem).text();
    })   

    res.json(JSON.stringify(times))
  } 
  catch (error) 
  {
    console.error('Error parsing website:', error);
    res.status(500).json({ error: 'Error parsing website' });
  }
}); 

app.get('/get_weekday', async (req, res) => 
{ 
  try 
  {
    let response;
    if(flag === false) 
      response = await axios.get(default_url);
    else
      response = await axios.get(url);

    const html = response.data;

    const $ = cheerio.load(html);
    
    const weeks = {};

    weeks[0] = $('body > div.container.timetable > div.card-default.timetable-card > div.timetable-card__nav > div.week-nav > a.week-nav-prev > span').text()
    weeks[1] = $('body > div.container.timetable > div.card-default.timetable-card > div.timetable-card__nav > div.week-nav > div > span').text()
    weeks[2] = $('body > div.container.timetable > div.card-default.timetable-card > div.timetable-card__nav > div.week-nav > a.week-nav-next > span').text()

    res.json(JSON.stringify(weeks))
  } 
  catch (error) 
  {
    console.error('Error parsing website:', error);
    res.status(500).json({ error: 'Error parsing website' });
  }
}); 