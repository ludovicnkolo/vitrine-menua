const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/App.jsx');
let content = fs.readFileSync(file, 'utf8');

// The current structure is:
// <div className="fade-in" style={{padding: "1rem"}}>
//   <div className="card" style={{maxWidth: "800px", margin: "0 auto", padding: "2rem"}}>

// Or for some pages:
// <div className="fade-in card" style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}>

// Let's remove the card class and max-width from all form wrappers.
content = content.replace(/className="card" style={{maxWidth: "800px", margin: "0 auto", padding: "2rem"}}/g, 
  'className="" style={{width: "100%", padding: "0"}}');

content = content.replace(/className="fade-in card" style={{padding: '2rem', maxWidth: '800px', margin: '0 auto'}}/g,
  'className="fade-in" style={{width: "100%", padding: "0"}}');

content = content.replace(/className="card" style={{width: '500px', position: 'relative'}}/g,
  'className="" style={{width: "100%", position: "relative"}}');


fs.writeFileSync(file, content);
console.log('Removed card wrappers.');
