import React, { useEffect, useState, useRef } from 'react';
import jsonGroups from './groups.json';
import jsonTeachers from './teachers.json';
import './App.css';

const Parser = () => 
{
  const [title, setTitle] = useState([]);
  const [time, setTime] = useState([]);
  const [weekday, setWeekday] = useState([]);
  const fetchData = useRef();

  function handleClick(event)
  {
    event.preventDefault(); 
    const data = event.target.textContent;
    fetchData.current(data);
  }

  useEffect(() => 
  {
    fetchData.current = async (weekDay) => 
    {
      try 
      {
        let input = document.getElementById('search').value;

        document.getElementById('shed_p').innerHTML = 'Расписание, ' + input;
        document.getElementById('group_p_inf').innerHTML = input;

        const numbers = input.match(/\d+/g); 

        var requestName = "https://ssau.ru/rasp?"
        let data = '';

        if (numbers) 
        {
          for(var elemG in jsonGroups)
          {
            for(var group in jsonGroups[elemG]['groups'])
            {
              if(group === input)
              {
                data = jsonGroups[elemG]['groups'][group];
              }
            }  
          }
          if(data || data === '')
            requestName = requestName + "groupId=" + data;
          else
            alert("UNCORRECT");        
        }
        else
        {
          for(var elemT in jsonTeachers)
          {
            if(elemT === input)
            {
              data = jsonTeachers[elemT];
            }
          }         
          if(data || data === '')
            requestName = requestName + "staffId=" + data;
          else
            alert("UNCORRECT");
        }
        if(weekDay === '')
          fetch(`/processing_link?param=${requestName}`)
        else
        {     
          let number = weekDay.match(/\d+/);
          requestName = requestName + "&selectedWeek=" + number + "&selectedWeekday=1";
          fetch(`/processing_link?param=${requestName}`)
        }

        const schedule = await fetch('/get_schedule');
        const format_schedule = await schedule.json();
        const cor_for_sch = format_schedule.split(',')
        const pars_sched = JSON.parse(cor_for_sch, ':');      

        const time = await fetch('/get_time');
        const format_time = await time.json();  
        const cor_for_time = format_time.split(',')
        const pars_time = JSON.parse(cor_for_time, ':');      

        const week = await fetch('/get_weekday');
        const format_week = await week.json();  
        const cor_for_week = format_week.split(',')
        const pars_week = JSON.parse(cor_for_week, ':');  

        let arr = {}; 
        for(let key in pars_sched)
        {
          arr[key] = pars_sched[key];
          if(pars_sched[key] === "")
            arr[key] = '';
        }

        setTime(pars_time);
        setTitle(arr);
        setWeekday(pars_week);
      } 
      catch (error) 
      {
        console.error('Error fetching data:', error);
      }
    };
    document.addEventListener('keyup', e => 
    {
      if(e.key === 'Enter') 
      {
        fetchData.current('');
      }
    })
  }, []);

  return (
    <div>
      <div className="table_header">
      {weekday[0]&&<a href="##" id="prev_link" onClick={handleClick} className="table_header_elem"><span>&#60;</span>
        {weekday[0]}
      </a>}
      {weekday[1]&&<a href="##" className="table_header_elem">
        {weekday[1]}
      </a>}
      {weekday[2]&&<a href="##" id="next_link" onClick={handleClick} className="table_header_elem">
        {weekday[2]}<span> &#62;</span>
      </a>}
    </div>
    <table className="table">
      <tbody>
      {title[0]&&title[1]&&title[2]&&title[3]&&title[4]&&title[5]&&title[6]&&<tr>
          <td>{title[0]}</td>
          <td>{title[1]}</td>
          <td>{title[2]}</td>
          <td>{title[3]}</td>
          <td>{title[4]}</td>
          <td>{title[5]}</td>
          <td>{title[6]}</td>
        </tr>}
        {time[0]&&<tr>
          <td>{time[0]}</td>
          <td>{title[7]}</td>
          <td>{title[8]}</td>
          <td>{title[9]}</td>
          <td>{title[10]}</td>
          <td>{title[11]}</td>
          <td>{title[12]}</td>
        </tr>}
        {time[1]&&<tr>
          <td>{time[1]}</td>
          <td>{title[13]}</td>
          <td>{title[14]}</td>
          <td>{title[15]}</td>
          <td>{title[16]}</td>
          <td>{title[17]}</td>
          <td>{title[18]}</td>
        </tr>}
        {time[2]&&<tr>
          <td>{time[2]}</td>
          <td>{title[19]}</td>
          <td>{title[20]}</td>
          <td>{title[21]}</td>
          <td>{title[22]}</td>
          <td>{title[23]}</td>
          <td>{title[24]}</td>
        </tr>}
        {time[3]&&<tr>
          <td>{time[3]}</td>
          <td>{title[25]}</td>
          <td>{title[26]}</td>
          <td>{title[27]}</td>
          <td>{title[28]}</td>
          <td>{title[29]}</td>
          <td>{title[30]}</td>
        </tr>}
        {time[4]&&<tr>
          <td>{time[4]}</td>
          <td>{title[31]}</td>
          <td>{title[32]}</td>
          <td>{title[33]}</td>
          <td>{title[34]}</td>
          <td>{title[35]}</td>
          <td>{title[36]}</td>
        </tr>}
        {time[5]&&<tr>
          <td>{time[5]}</td>
          <td>{title[37]}</td>
          <td>{title[38]}</td>
          <td>{title[39]}</td>
          <td>{title[40]}</td>
          <td>{title[41]}</td>
          <td>{title[42]}</td>
        </tr>}
      </tbody>
    </table>
    </div>
  );
};

export default Parser;





