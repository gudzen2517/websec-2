import React, { useState } from 'react';
function InputExample() 
{
  const [value, setValue] = useState('');
  
  const handleChange = (event) => 
  {
    setValue(event.target.value);
  }
  
  return (
    <input id="search" placeholder="Поиск" type="text" value={value} onChange={handleChange} />
  );
}
  
export default InputExample;