const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const app = express();

// Initialize Sequelize
const sequelize = new Sequelize({
  dialect: 'postgres',
  database: 'postgres',
  username: 'postgres',
  password: 'postgres',
  host: 'localhost',
});

app.use(express.json());

// Define the Point model
const Point = sequelize.define('Point', {
  name: DataTypes.STRING,
  location: DataTypes.GEOMETRY('POINT', 4326),
});

// Define the Polygon model
const Polygon = sequelize.define('Polygon', {
   name: DataTypes.STRING,
   coordinates: DataTypes.GEOMETRY('POLYGON', 4326),
 });


app.post('/api/points', async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;
    const point = await Point.create({
      name,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude],
      },
    });
    res.json(point);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create point' });
  }
});

app.get('/api/points', async (req, res) => {
   try {
     const points = await Point.findAll();
     res.json(points);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Could not retrieve points' });
   }
 });

 
 app.put('/api/points/:id', async (req, res) => {
   const pointId = req.params.id;
   try {
     const point = await Point.findByPk(pointId);
     if (!point) {
       return res.status(404).json({ error: 'Point not found' });
     }
     const { name, latitude, longitude } = req.body;
     await point.update({
       name,
       location: {
         type: 'Point',
         coordinates: [longitude, latitude],
       },
     });
     res.json(point);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Could not update point' });
   }
 });

 app.delete('/api/points/:id', async (req, res) => {
   const pointId = req.params.id;
   try {
     const point = await Point.findByPk(pointId);
     if (!point) {
       return res.status(404).json({ error: 'Point not found' });
     }
     await point.destroy();
     res.json({ message: 'Point deleted' });
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Could not delete point' });
   }
 });


app.post('/api/polygons', async (req, res) => {
   try {
     const { name, coordinates } = req.body;
     const polygon = await Polygon.create({
       name,
       coordinates: {
         type: 'Polygon',
         coordinates: coordinates,
       },
     });
     res.json(polygon);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Could not create polygon' });
   }
 });

 app.get('/api/polygons', async (req, res) => {
   try {
     const polygons = await Polygon.findAll();
     res.json(polygons);
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Could not retrieve polygons' });
   }
 });
 

 app.put('/api/polygons/:id', async (req, res) => {
   const polygonId = req.params.id;
   try {
     const polygon = await Polygon.findByPk(polygonId);
     if (!polygon) {
       return res.status(404).json({ error: 'Polygon not found' });
     }
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Could not update polygon' });
   }
 });

 app.delete('/api/polygons/:id', async (req, res) => {
   const polygonId = req.params.id;
   try {
     const polygon = await Polygon.findByPk(polygonId);
     if (!polygon) {
       return res.status(404).json({ error: 'Polygon not found' });
     }
     await polygon.destroy();
     res.json({ message: 'Polygon deleted' });
   } catch (error) {
     console.error(error);
     res.status(500).json({ error: 'Could not delete polygon' });
   }
 });
 
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});