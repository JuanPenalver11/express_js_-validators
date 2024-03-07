// validators are very important.
// validators guarantee that information sent to the server respect some premises.

import express from "express"; //npm i express;
import { query, validationResult, body, matchedData, checkSchema } from "express-validator"; //npm i express-validator
import {createUserValidationSchema} from './utils/validationSchemas.mjs';

// query is used to validated query strings it will be used as a middleware.
// body is used to validated body :)
// validationResult is a function that takes request as an argument and return
// a response indicating whether the query information is valid or not, depending
// on the methods you may have stablish previously.
// matchedData function that uses the data vaildated to form an object.
//checkSchema is used to have a neater document. --> checkSchema is link to validationSchema.js

const app = express();

app.use(express.json());

const idGenrator = () => {
  return Math.floor(Math.random() * 1000);
};

const products = [
  { id: idGenrator(), name: "fruits", location: "Madrid" },
  { id: idGenrator(), name: "meat", location: "Barcelona" },
  { id: idGenrator(), name: "fish", location: "Sevilla" },
  { id: idGenrator(), name: "vegetables", location: "Baleares" },
  { id: idGenrator(), name: "dairy products", location: "Canarias" },
];

const PORT = process.env.PORT || 3000;

app.get("/", (request, response) => {
  response.status(200).send("Hello World");
});

app.get(
  "/api/products",
  query("filter")
    //query has different methods to check whether the query information
    // set respond to some requirements, Below a few.
    .isString()
    .withMessage("Filter has to be a string")
    .notEmpty()
    .withMessage("You can filter either name or location"),
  (request, response) => {
    const result = validationResult(request);
    console.log(result);
    const { filter, value } = request.query;
    //cuidado toLowerCase es un metodo que se debe aplicar al string en si,
    //no se puede aplicar al objeto.

    if (!filter && !value) return response.status(200).send(products);

    const minuscule = products.map((product) => {
      return {
        ...product,
        name: product.name.toLowerCase(),
        location: product.location.toLowerCase(),
      };
    });

    const filteredValue = minuscule.filter((product) =>
      product[filter].includes(value)
    );

    if (filter && value) return response.status(200).send(filteredValue);
  }
);

app.post(
  "/api/products",
  //information obtained from body
  body(["name", "location"])
    //in order to pass more than one field you need to pass and array containing the field
    //like above.
    .notEmpty()
    .withMessage("POST requires name and location properties")
    .isString()
    .withMessage("name and location are strings"),
  (request, response) => {
    const result = validationResult(request);
    //if result is positive it return an empty array.
    //Hence, to check whether infomation submitted is right,
    // we are going to create the following if statment.
    //if result is not empty then isEmpty will return false
    if (!result.isEmpty()) {
      return response.status(400).send({ error: result.array() });
    }
    const data = matchedData(request);
    //matchedData will obtain from request all the validated data

    // const { body } = request; we cannot use body because we don't know
    //whether that date is valid. However, we know that data has being validated.
    //const newProduct = { id: idGenrator(), ...body  }; ==> we change body for data
    const newProduct = { id: idGenrator(), ...data };
    products.push(newProduct);
    response.status(201).send(newProduct);
  }
);

app.put("/api/products/:id",checkSchema(createUserValidationSchema), (request, response) => {
    //we use checkSchema to pass our object with all the checks we desire 
    // the information to pass
    const result = validationResult(request)
    if(!result.isEmpty()){
        return response.status(400).send({error:result.array()})
    }
    const data = matchedData(request)
    const {
      params: { id },
    } = request;
    const idParsed = parseInt(id);
    if (isNaN(idParsed)) return response.sendStatus(400);
    const productIndex = products.findIndex((product) => product.id === idParsed);
    if (productIndex !== -1) {
      products[productIndex] = { id: products[productIndex].id, ...data };
      return response.sendStatus(201);
    } else {
      return response.sendStatus(418);
    }
  });
  

app.listen(PORT, () => {
  console.log(`PORT device on ${PORT}`);
});
