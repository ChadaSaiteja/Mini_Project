import express, { Request, Response, response } from "express"
import { body, validationResult } from "express-validator";
import AppDataSourc from "../../ormconfig";
import { Project } from "../entities/Project";
import { Employee } from "../entities/Employee";


const projectRouter=express.Router();

// Add a project
projectRouter.post('/',
    body('name').not().isEmpty().withMessage("Project name cannot be empty")
    ,async(req:Request,res:Response)=>{
        
        //project table
        const projectRepo=AppDataSourc.getRepository(Project);
        
        //checking input request
        let error=validationResult(req);
        if(!error.isEmpty())
        {
           return res.status(400).json({errors:error.array()})
        }

        //project object
        const project=new Project();
        project.name=req.body.name;

        //adding the new project to db
        const savedProject=await projectRepo.save(project);

        res.status(200).send(savedProject);
})

//get all projects
projectRouter.get('/',async(req:Request,res:Response)=>{
    //Project table
    const projectRepo=AppDataSourc.getRepository(Project);
    let allProjects=await projectRepo.find();
    res.status(200).json(allProjects);

})

//get project by id
projectRouter.get('/id/:pid',async(req:Request,res:Response)=>{
    //Project table
    const projectRepo=AppDataSourc.getRepository(Project);
    let id=Number(req.params.pid);

    //getting record based on id
    let project=await projectRepo.find({where:{id:id}});

    if(project.length===0)
        return res.status(400).send("Invalid Project id")
    res.status(200).send(project)

})

//get project by name
projectRouter.get('/name',async(req:Request,res:Response)=>{
    //project table
    const projectRepo=AppDataSourc.getRepository(Project);
    
    let pname=req.query.pname as string;
    
    //getting record based on name
    let project=await projectRepo.find({where:{name:pname}});
    
    if(project.length===0)
        return res.status(400).send("Invalid Project name")
    res.status(200).send(project)

})



//adding an employee to project
projectRouter.put("/addEmpToProject",async(req:Request,res:Response)=>{
    //query parameters
    const {pid,eid,pname,ename}=req.query;

    //Project table
    const projectRepo=AppDataSourc.getRepository(Project);

    //Employee table
    const employeeRepo=AppDataSourc.getRepository(Employee);

    if(pid!==undefined&&eid!==undefined)
    {   
        //finding employee by eid
        const employee=await employeeRepo.findOne({where:{id:Number(eid)}});

        //finding project by pid
        const project=await projectRepo.findOne({where:{id:Number(pid)}});

        if(employee===null)
            return res.send("eid is not valid")
        if(project===null)
            return res.send("pid is not valid")

        //adding empoyee to project
        project.employee.push(employee)  

        //saving into db with updated employee list
        await projectRepo.save(project)

        res.send(project);
    }
    else if(pname!==undefined&&ename!==undefined)
    {
        //finding employee by eid
        const employee=await employeeRepo.findOne({where:{name:ename as string}});
        
        //finding project by pid
        const project=await projectRepo.findOne({where:{name:pname as string}});
        
        if(employee===null)
            return res.send("ename is not valid")
        if(project===null)
            return res.send("pname is not valid") 
        
        //adding empoyee to project
        project.employee.push(employee);

        //saving into db with updated employee list 
        await projectRepo.save(project);

        res.send(project)
    }
})



//delete project
projectRouter.delete('/',async(req:Request,res:Response)=>{

    let pid=Number(req.query.pid);
    let pname=req.query.pname as string;
    
    //Project table
    const projectRepo=AppDataSourc.getRepository(Project);

    if(pid!==undefined)
    {
        
        let deleted=await projectRepo.delete(pid);
        
        if(deleted.affected===0)
            return res.send("Invalid pid ");
       
    }
    else if(pname!==undefined)
    {
        
        let deleted=await projectRepo.delete({name:pname});
        if(deleted.affected===0)
            return res.send("Invalid pname")
        
    }

    res.send("Project deleted sucessfully");

})


export default projectRouter;