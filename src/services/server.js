import express from 'express'
import path from 'path'
import handlebars from 'express-handlebars'
import miRouter from '../routes/index';
import session from 'express-session'
import cookieParser from 'cookie-parser';
import passport from '../middlewares/auth'

const app = express();

app.use(express.json())

app.use(
  session({
    secret: 'your secret line of secretness',
    resave: true,
    saveUninitialized: true,
  })
);

const publicPath = path.resolve(__dirname, '../../public');
app.use(express.static(publicPath));

app.use(passport.initialize());
app.use(passport.session());

const viewsPath = path.resolve(__dirname, '../../views');
const layoutDirPath = viewsPath + '/layouts';
const defaultLayerPth = viewsPath + '/layouts/main.hbs';
const partialDirPath = viewsPath + '/partials';

app.set('view engine', 'hbs');
app.engine(
  'hbs',
  handlebars({
    layoutsDir: layoutDirPath,
    extname: 'hbs',
    defaultLayout: defaultLayerPth,
    partialsDir: partialDirPath,
  })
);


/* Router */
app.use('/', miRouter)

export default app;