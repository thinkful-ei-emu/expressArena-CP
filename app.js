const express=require('express');
const morgan =require('morgan');
const app= express();
app.use(morgan('dev'));
app.get('/',(req,res)=>{
  res.send('Hello Express!');
});
app.get('/burgers', (req, res) => {
  res.send('We have juicy cheese burgers!');
});
app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
    Fresh?: ${req.fresh}
  `;
  res.send(responseText);
});
app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

app.get('/sum', (req,res)=>{
  if(req.query.a===undefined ||req.query.b===undefined){
    res.status(400).send('Need a and b as queries');
  }
  let a=parseInt(req.query.a);
  let b=parseInt(req.query.b);
  if(isNaN(a)||isNaN(b)){
    res.status(400).send('Need a and b to have number values');
  }
  res.send(`The sum of a and b is ${a+b}`);
});

app.get('/cipher', (req,res) => {
  const { text } = req.query;
  if( text === undefined || req.query.shift === undefined ) {
    res.status(400).send('Need to submit both text and the shift amount');
  }  
  const shift = parseInt(req.query.shift);
  if(isNaN(shift)){
    res.status(400).send('Shift must be a number');
  }
  let newText = text.toUpperCase();
  let textArr = [];
  for(let i = 0; i < newText.length; i++) {
    if(newText[i].charCodeAt(0) < 65 || newText[i].charCodeAt(0) > 90) {
      textArr.push(newText[i]);
    }
    else {
      let num = newText[i].charCodeAt(0) + (shift % 26 + 26 ) % 26;
      if(num > 90) {
        num = num - 26;
      }
      textArr.push(String.fromCharCode(num));
    }
  }
  res.send(textArr.join(''));
});

app.get('/lotto', (req,res) => {
  if(!Array.isArray(req.query.arr)){
    res.status(400).send('This must be in the form of an array');
  }
  if(req.query.arr.length !== 6){
    res.status(400).send('You must only submit 6 numbers');
  }  
  
  let results = [];
  let counter = 0;
  let newArr = req.query.arr.map(idx => parseInt(idx));
  if(newArr.includes(NaN)) {
    res.status(400).send('You may only enter a valid number');
  }
  if(newArr.find(x => x < 1 || x > 20)){
    res.status(400).send('You may only enter numbers between 1 and 20');
  }

  while(results.length < 6) {
    let num = Math.ceil(Math.random() * 20);
    if(!results.includes(num)){
      results.push(num);
      if(newArr.includes(num)) {
        counter++;
      }
    }
  }
  
  console.log(results, counter);

  if(counter < 4) {
    res.send('Sorry, you lose');
  }
  if(counter === 4) {
    res.send('Congratulations, you win a free ticket');
  }
  if(counter === 5) {
    res.send('Congratulations! You win $100!');
  }
  if(counter === 6) {
    res.send('Wow! Unbelievable! You could have won the mega millions!');
  }
});

app.listen(8000, ()=>{
  console.log('Express server is listening on port 8000');
});
