import express from "express";
import cors from "cors";
import { sample_foods, sample_tags } from "./data";

const app = express();
//localhost 4200 frontend
//localhost 5000 backend
// by default it is unexeptable to have a request from an adress to a different address
// that the reason we need cors
// we need cors only for development time
app.use(cors({
    credentials:true,
    origin:["http://localhost:4200"]
}));
app.get("/api/foods",(req,res)=>{
    res.send(sample_foods);
})
const port =5000;
app.listen(port, ()=>{
    console.log("Website served on http://localhost:"+port);
})

app.get("/api/foods/search/:searchTerm", (req, res) => {
  const searchTerm  = req.params.searchTerm;
  const foods = sample_foods
  .filter(food => food.name.toLowerCase()
  .includes(searchTerm.toLowerCase()));
  res.send(foods);
})

app.get("/api/foods/tags", (req, res) => {
  res.send(sample_tags);
})

app.get("/api/foods/tag/:tagName", (req, res) => {
  const tagName = req.params.tagName;
  const foods = sample_foods.filter(food => {
    if (Array.isArray(food.tags)) {
      return food.tags.some((tag: string) => tag.toLowerCase() === tagName.toLowerCase());
    }
    return false; // Handle cases where tags is not an array
  });
  res.send(foods);
})

app.get("/api/foods/:foodId", (req, res) => {
  const foodId = req.params.foodId;
  const food = sample_foods.find(food => food.id == foodId);
  res.send(food);
})
