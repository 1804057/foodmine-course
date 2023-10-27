export class Food{
  id!:string;
  name!:string; //!==required
  price!:number;
  tags?: string[]; //?== optional
  favorite!:boolean;
  stars!: number;
  imageUrl!: string;
  origins!: string[];
  cookTime!:string;
}