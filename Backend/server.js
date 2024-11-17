require('dotenv').config();
const express = require('express')
const sql = require('mssql')
const cors = require('cors')

const app=express();
app.use(cors());

const config={
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options:{
        trustServerCertificate: true,
        trustedConnection: false,
        enableArithAbort: true,
        instancename:"SQLEXPRESS",
    },
    port: parseInt(process.env.DB_PORT, 10),
}

app.get('/api/top10', async(req, res)=>{
    try{
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT TOP 10 * FROM Player WHERE Tid=1");

        const response = [
            {
                name: "Baltimore Players with the lowest numbers",
                top10: result.recordset
            }
        ]
    
        res.json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Database query failed")
    }
})


app.get('/api/connections', async(req, res)=>{
    try{
        const connection = [
            {
                name: "Group1",
                connections: [
                    {
                        name: "ConnectionEasy",
                        elements: ["Roquan Smith", "Nate Wiggins", "Deonte Harty", "Zay Flowers"]
                    },
                    {
                        name: "ConnectionMedium",
                        elements: ["Jalyn Armour-Davis", "Rashod Bateman", "Lamar Jackson", "Justin Tucker"]
                    },
                    {
                        name: "ConnectionHard",
                        elements: ["Arthur Maulet", "Jordan Stout", "Malik Cunningham", "Kyle Hamilton"]
                    },
                    {
                        name: "ConnectionExtreme",
                        elements: ["Nelson Agholor", "Tylan Wallace", "Josh Johnson", "Tyler Huntley"]
                    }
                ]
            }
        ];
    
        res.json(connection);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Database query failed")
    }
})

app.get('/api/filter-player/:filter', async(req, res)=>{
    const filter = req.params.filter;

    try{
        if(filter.length < 3)
            res.json("Filter too short");
        const pool = await sql.connect(config);
        const result = await pool.request()
        .input('filterStart', sql.NVarChar, `${filter}%`)
        .input('filterMiddle', sql.NVarChar, `%${filter}%`)
        .input('filterEnd', sql.NVarChar, `%${filter}`)
        .query(`
            SELECT Player.*, Division.Name as DivName
            FROM Player 
            INNER JOIN Team ON Player.Tid = Team.Tid
            INNER JOIN Division ON Team.Did = Division.Did
            WHERE Player.Name like @filterStart 
                    OR Player.Name like @filterMiddle OR Player.Name like @filterEnd`);
        res.json(result.recordset);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Database query failed");
    }
})

app.get('/api/count-player', async(req, res)=>{
    try{
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT COUNT(*) as count FROM Player');
        res.json({players: result.recordset[0].count});
    }
    catch(err){
        console.log(err);
        res.status(500).send("Database query failed");
    }
})

app.get('/api/mystery-player', async(req, res)=>{
    try{
        const pool = await sql.connect(config);
        const nrRecords = await pool.request().query('SELECT COUNT(*) as count FROM Player');
        const nrPlayers = nrRecords.recordset[0].count;
        const randomPid = Math.floor(Math.random() * nrPlayers) + 1;
        const result = await pool.request().query(`
            SELECT Player.*, Division.Name as DivName
            FROM Player 
            INNER JOIN Team ON Player.Tid = Team.Tid
            INNER JOIN Division ON Team.Did = Division.Did
            WHERE Pid=${randomPid}`);
        res.json(result.recordset); 
    }
    catch(err){
        console.log(err);
        res.status(500).send("Database query failed");
    }
})

app.get('/api/wordle-player', async(req, res)=>{
    try{
        const pool = await sql.connect(config);
        const nrRecords = await pool.request().query('SELECT COUNT(*) as count FROM Player');
        const nrPlayers = nrRecords.recordset[0].count;
        let length = 0;
        let result;
        do{        
            length = 0;
            const randomPid = Math.floor(Math.random() * nrPlayers) + 1;
            result = await pool.request().query(`SELECT Player.Name, Player.Jersey FROM Player WHERE Pid=${randomPid}`);
            
            let playerName = result.recordset[0].Name.split(" ");
            for(let i=1; i<playerName.length; i++)
                length += playerName[i].length;
        }while(!(4 < length && length < 9));

        res.json(result.recordset);
    }
    catch(err){
        console.log(err);
        res.status(500).send("Database query failed")
    }
})

app.get('/api/players', async(req, res)=>{
    try{
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM Player');
        res.json(result.recordset); 
    }
    catch(err){
        console.log(err);
        res.status(500).send("Database query failed");
    }
})

app.get('/', (req, res)=>{
    return res.json("Hi i am backend");
}) 

app.listen(3000, ()=>{
    console.log("The server has started");
})