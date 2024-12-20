 const { 
    client, 
    createTables, 
    createProduct, 
    createUser,
    fetchUsers,
    fetchProducts,
    createFavorite,
    fetchFavorites,
    destroyFavorite
} = require('./db');
 
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('morgan')('dev'));

app.get('/api/users', async (req, res) => {
   try{
      res.send(await fetchUsers());

   } catch(ex) {
      next(ex);
   }
});

app.get('/api/products', async (req, res, next) => {
   try {
       res.send(await fetchProducts());
   } catch (ex) {
       next(ex);
   }
});
app.get('/api/users/:id/favorites', async (req, res, next) => {
   try {
       res.send(await fetchFavorites({ user_id: req.params.id }));        
   } catch (ex) {
       next(ex)
   }
});
app.post('/api/users/:id/favorites', async (req, res, next) => {
   try {
       res.send(await createFavorite({ product_id: req.body.product_id, user_id: req.params.id }));
   } catch (ex) {
       next(ex);
   }
});
app.delete('/api/users/:id/favorites/:favorite_id', async (req, res, next) => {
   try {
       await destroyFavorite({ user_id: req.params.id, id: req.params.favorite_id});
       res.sendStatus(204);
   } catch (ex) {
       next(ex);
   }
});

 
 const init = async () => {
    await client.connect();
    console.log('connected to db');
    await createTables();
    console.log('created tables');
    
 };

 init();