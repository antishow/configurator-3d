const express = require('express');
const app = new express();

app.use(express.static('docs'));
app.listen(3000, () => {
	console.log('Listening on port 3000!');
});
