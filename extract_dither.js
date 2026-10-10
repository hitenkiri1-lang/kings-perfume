import fs from 'fs';
fetch('https://reactbits.dev/r/Dither-JS-CSS.json').then(res => res.json()).then(data => {
  fs.writeFileSync('src/components/ui/Dither.jsx', data.files[1].content);
  fs.writeFileSync('src/components/ui/Dither.css', data.files[0].content);
  console.log('Dither component extracted successfully');
});
