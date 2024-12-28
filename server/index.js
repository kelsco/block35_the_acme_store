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

app.get('/api/users', async (req, res, next) => {
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
    const [ crate, dogFood, peePads, cot, leash, bernie, luanne, reese, mistaPickles] = await Promise.all([
      await createProduct({ name: 'crate'}),
      await createProduct({ name: 'dog food'}),
      await createProduct({ name: 'pee pads'}),
      await createProduct({ name: 'cot'}),
      await createProduct({ name: 'leash'}),
      await createUser({ username: 'Bernie', password: 'GoldenDelicious'}),
      await createUser({ username: 'Luanne', password: 'blackandtanpiebald'}),
      await createUser({ username: 'Reese', password: 'chocolatedapple'}),
      await createUser({ username: 'Mr. Pickles', password: 'blackandcreamlong'})
    ]);
    const users = await fetchUsers();
    console.log(users);
    const products = await fetchProducts();
    console.log(products);
    const [ bernieFav, luanneFav, reeseFav, mistaPicklesFav ] = await Promise.all([
      await createFavorite({ user_id: bernie.id, product_id: dogFood.id}),
      await createFavorite({ user_id: luanne.id, product_id: cot.id}),
      await createFavorite({ user_id: reese.id, product_id: leash.id}),
      await createFavorite({ user_id: mistaPickles.id, product_id: crate.id})
    ]);
    console.log('fetchFavorites: ', await fetchFavorites({ user_id: bernie.id}));
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));

 };

 init();