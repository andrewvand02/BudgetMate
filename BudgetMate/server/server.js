const express =require("express");
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const corsOptions={
    origin: ["http://localhost:5173"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());


app.post('/api/income', (req, res) => {
    const { income } = req.body;
    // Probably put into storage here, still need to validate if user input is valid
    console.log(`Income received: ${income}`);
    res.json({ message: 'Income recorded successfully!' });
});

app.listen(8080, () => {
    console.log("Server started on port 8080");

})

