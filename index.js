import express from "express";
import pg from "pg";
import 'dotenv/config';

const app = express();
app.use(express.urlencoded());
app.use(express.static("public"));

//When using local postgres db
// const db = new pg.Client({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_DB,
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT
// });

//When using remote Postgres Db
const db = new pg.Client(process.env.DB_LINK);
db.connect();

app.get("/", async (req, res) => {
    const result = await db.query("Select * from list");
    res.render("index.ejs", {bookList: result.rows});
});

app.get("/sortRating", async(req, res) => {
    const result = await db.query("Select * from list order by rating desc");
    res.render("index.ejs", {bookList: result.rows});
});

app.get("/sortByDate", async(req, res) => {
    const result = await db.query("Select * from list order by readingdate desc");
    res.render("index.ejs", {bookList: result.rows});
});

app.get("/editorsPanel", (req, res) => {
    res.render("editorsPanel.ejs");
});

app.post("/addBook", async(req, res) => {
    try {
        await db.query("insert into list (title, author, isbn, description, rating, readingdate) values ($1, $2, $3, $4, $5, $6)", 
        [req.body.title, req.body.author, req.body.isbn, req.body.description, req.body.rating, req.body.readingdate]);

        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

app.post("/deleteBook", async (req, res) => {
    try {
        console.log(req.body);
        await db.query("delete from list where title = $1", [req.body.title]);
        res.redirect("/");
    } catch (error) {
        console.log(error);
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});