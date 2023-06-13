import express,{Request,Response, response}  from "express"
import AppDataSourc from "../../ormconfig";
import { Location } from "../entities/Location";
import { body ,validationResult} from "express-validator";

const locationRouter=express.Router()

// creating a location
locationRouter.post('/',
    [
        body("city").not().isEmpty().withMessage("city can not be empty"),
        body("country").not().isEmpty().withMessage("country can not be empty")
    ],
    async(req:Request,res:Response)=>{
    // Location table
    const locationRepo=AppDataSourc.getRepository(Location);
    
    //validating errors in request
    let error=validationResult(req);
    if(!error.isEmpty())
    {
        return res.status(404).json({errors:error.array()})
    }

    let {city,country}=req.body

    //location object
    let location=new Location();
    location.city=city;
    location.country=country;

    try{
        //saving the new location into db
        await locationRepo.save(location);}
    catch(err)
    {
        res.status(400).send("location already exsist")

    }

    res.status(200).json({
        message:"location added",
        location:location
    })    
})

//get all locations
locationRouter.get('/',async(req:Request,res:Response)=>{
    //location table
    const locationRepo=AppDataSourc.getRepository(Location);
    
    //getting all locations from db
    const allLocations=await locationRepo.find();

    res.status(200).json(allLocations)
})


//delete a location
locationRouter.delete('/',async(req:Request,res:Response)=>{
    //location table
    const locationRepo=AppDataSourc.getRepository(Location);

    //query parameters
    const  city=req.query.city as string;
    const  country=req.query.country as string;
    
    //deleting a location from db
    
    let deleted=await locationRepo.delete({city,country})
    if(deleted.affected===0)
    {
        return res.status(400).send("Record not found")
    }
    
    res.status(200).send("Record deleted")
})

export default locationRouter;