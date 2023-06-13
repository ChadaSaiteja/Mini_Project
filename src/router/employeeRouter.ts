import express, { Request, Response, response } from "express"
import AppDataSourc from "../../ormconfig";
import { Employee } from "../entities/Employee";
import { EmployeeDetails } from "../entities/EmployeeDetails";
import { Result, body, validationResult } from "express-validator";
import { Location } from "../entities/Location";
import { Project } from "../entities/Project";


const employeeRouter=express.Router();

//add a employee
employeeRouter.post('/',
    [
        body('name').not().isEmpty().withMessage("name cannot be empty"),
        body('city').not().isEmpty().withMessage("city cannot be empty"),
        body('country').not().isEmpty().withMessage("country cannot be empty"),
        body('salary').not().isEmpty().withMessage("salary cannot be empty"),
        body('phno').not().isEmpty().withMessage("phno cannot be empty")
    ]
    ,async(req:Request,res:Response)=>{

    //Employee table
    const employeeRepo=AppDataSourc.getRepository(Employee);

    //EmployeeDetails table
    const employeeDetailsRepo=AppDataSourc.getRepository(EmployeeDetails);

    //Location table
    const locationRepo=AppDataSourc.getRepository(Location);
    
    let error=validationResult(req);
    if(!error.isEmpty())
    {
       return res.status(400).json({errors:error.array()})
    }


    const {name,city,country,salary,phno,experience}=req.body;

    //EmployeeDetails object
    let employeeDetails=new EmployeeDetails();

    //Employee object
    let employee=new Employee();
    employee.name=name;
    employeeDetails.employee=employee;

    //checking location is available in db
    let locationFetched=await locationRepo.find({where:{city:city,country:country}})
    if(locationFetched.length!==0)
    {
        employeeDetails.location=locationFetched[0];
    }
    else{
        //location created as it is not present in db
        let location=new Location();
        location.city=city;
        location.country=country;
        employeeDetails.location=location;
    }
    employeeDetails.experience=experience;
    employeeDetails.phno=phno;
    employeeDetails.salary=salary;
    
    //saving into db
    let newEmployee=await employeeDetailsRepo.save(employeeDetails)

    res.status(200).send(newEmployee)

})


//get all employees
employeeRouter.get('/',async(req:Request,res:Response)=>{
    const employeeDetailsRepo=AppDataSourc.getRepository(EmployeeDetails);
    const allEmployeeDetails=await employeeDetailsRepo.find();
    res.status(200).json(allEmployeeDetails);
})

//get employee by id
employeeRouter.get('/id/:id',async(req:Request,res:Response)=>{
    //EmployeeDetails table
    const employeeDetailsRepo=AppDataSourc.getRepository(EmployeeDetails);
    let id=Number(req.params.id);

    //finding employee details by eid
    const employee=await employeeDetailsRepo.find({where:{employee:{id:id}}});

    if(employee.length===0)
        return res.status(400).send("Invalid id")
    res.status(200).json(employee);

})

//get employee by name
employeeRouter.get('/name',async(req:Request,res:Response)=>{

    //EmployeeDetails table
    const employeeDetailsRepo=AppDataSourc.getRepository(EmployeeDetails);

    let name=req.query.name as string;

    //finfing employee details by employee name
    const employee=await employeeDetailsRepo.find({where:{employee:{name:name}}});

    if(employee.length===0)
        return res.status(400).send("Invalid name")
    res.status(200).json(employee);

})



//get employee names by location name
employeeRouter.get('/getEmpByLocation',async(req:Request,res:Response)=>{

    let location=req.query.location as string;

    //Query for getting employee names for particular location
    const queryBuilder=AppDataSourc
                    .createQueryBuilder()
                    .select('e.name','name')
                    .from(Employee,'e')
                    .innerJoin(EmployeeDetails,'ed','e.id=ed.employeeId')
                    .innerJoin(Location,'l','l.id=ed.locationId')
                    .where('l.city= :city',{city:location})
    
    
    const result=await queryBuilder.getRawMany();
    if(result.length===0)
        return res.send('enter valid location')
    const names:string[]=[];
    result.map((i)=>names.push(i.name));
    res.json({location:location,employees:names})
   

})

//get project names that an employee working on
employeeRouter.get('/projectsByEmpName',async(req:Request,res:Response)=>{

    const ename=req.query.ename as string;

    //query for getting project names for a particular employee working on
    const queryBuilder = AppDataSourc.getRepository(Employee)
                        .createQueryBuilder('employee')
                        .leftJoinAndSelect('employee.projects', 'project')
                        .where('employee.name= :name',{name:ename})

    const result=await queryBuilder.getOne()

    if(result===null)
        return res.send("Please enter correct employee name")
    
    const projects:string[]=[];
    result.projects.map((id)=>projects.push(id.name))

    res.json({name:ename,projects:projects})
})




//Updating the employee details
employeeRouter.put('/',async(req:Request,res:Response)=>{
    //EmployeeDetails table
    const employeeDetailsRepo=AppDataSourc.getRepository(EmployeeDetails);
    
    //Location table
    const locationRepo=AppDataSourc.getRepository(Location);

    const {name,city,country,salary,phno,experience}=req.body;
    const ename=req.query.ename as string;

    if(req.query.eid===undefined&&req.query.ename===undefined)
        return res.status(400).send("Please enter valid eid or ename");

    if(req.query.eid!==undefined)
    {   
        let eid=Number(req.query.eid);
        try{
            //getting employee details by eid
            let employeeDetails=await employeeDetailsRepo.findOne({where:{employee:{id:eid}}})
            if(employeeDetails===null)
                return res.send('enter valid eid')

            //getting location by city and country
            let locationFetched=await locationRepo.findOne({where:{city:city,country:country}})

            if(locationFetched===null)
            {
                let location=new Location();
                location.city=city;
                location.country=country;
                employeeDetails.location=location;
            }
            else
            {
                employeeDetails.location=locationFetched;
            }
            if(experience!==undefined)
                employeeDetails.experience=experience;
            if(salary!==undefined)
                employeeDetails.salary=salary;
            if(phno!==undefined)
                employeeDetails.phno=phno;

            //updating the employee details in db
            await employeeDetailsRepo.save(employeeDetails)

            return res.send("Updated Succesfully");
        }
        catch(err)
        {
            res.status(400).send(err);
        }
        
    }
    else if(ename!==undefined)
    {
        try{
            //getting employee details by ename
            let employeeDetails=await employeeDetailsRepo.findOne({where:{employee:{name:ename}}})
            if(employeeDetails===null)
                return res.send('enter valid ename')  

            //getting a location by city and country
            let locationFetched=await locationRepo.findOne({where:{city:city,country:country}})
            
            if(locationFetched===null)
            {
                let location=new Location();
                location.city=city;
                location.country=country;
                employeeDetails.location=location;
            }else{
                employeeDetails.location=locationFetched
            }

            if(experience!==undefined)
                employeeDetails.experience=experience;
            if(salary!==undefined)
                employeeDetails.salary=salary;
            if(phno!==undefined)
                employeeDetails.phno=phno;
            
            //updating the employee details in db
            await employeeDetailsRepo.save(employeeDetails)
            res.status(200).send("Updated Succesfully")
        }
        catch(err)
        {
            res.status(400).send(err);
        }
    }  

})


//delete a employee 
employeeRouter.delete('/',async(req:Request,res:Response)=>{
    //Employee table
    const employeeRepo=AppDataSourc.getRepository(Employee);

    const ename=req.query.ename as string;

    if(req.query.eid!==undefined)
    {   
        const eid=Number(req.query.eid);
    
        //deleting a employee details by eid
        let deleted=await employeeRepo.delete(eid)
        
        if(deleted.affected===0)
            return res.send("enter valid eid")
        
        
    }
    else if(ename!==undefined)
    {
       
        //deleting a employee details by ename
        let deleted=await employeeRepo.delete({name:ename}) 
        
        if(deleted.affected===0)
            return res.send("enter valid ename")
        
    }
    res.status(200).send("Record deleted")
})


export default employeeRouter;