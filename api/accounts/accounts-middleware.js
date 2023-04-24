const accountsModel = require("./accounts-model");
const yup = require("yup");

/*const accountsScheme = yup.object().shape({
  name: yup
    .string()
    .min(3,"name of account must be between 3 and 100")
    .max(100,"name of account must be between 3 and 100")
    .required("name and budget are required"),
  budget: yup
      .number("budget of account must be a number")
      .min(0,"budget of account is too large or too small")
      .max(1000000,"budget of account is too large or too small")
      .required("name and budget are required")
});*/


exports.checkAccountPayload = async (req, res, next) => {
  // KODLAR BURAYA
  // Not: Validasyon için Yup(şu an yüklü değil!) kullanabilirsiniz veya kendiniz manuel yazabilirsiniz.
  try {
    const {name,budget} = req.body;
    if(name === undefined || budget === undefined){
      res.status(400).json({message:"name and budget are required"})
    }else{
      req.body.name = req.body.name.trim();
      if(req.body.name.length<3 || req.body.name.length>100){
        res.status(400).json({message:"name of account must be between 3 and 100"})
      }
      else if(typeof(budget) !== "number"){
        res.status(400).json({message:"budget of account must be a number"})
      }
      else if(budget>1000000 || budget<0){
        res.status(400).json({message:"budget of account is too large or too small"})
      }else{
        next();
      }
     //await accountsScheme.validate(req.body);
    }
  } catch (error) {
    res.status(400).json({message:error.message})
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
  // KODLAR BURAYA
  try {
    if(req.body && req.body.name){
      req.body.name = req.body.name.trim();
    }

    //BEGIN KÖTÜ ÖRNEK
    /*const allData = await accountsModel.getAll();
    let isExist = allData.find(x=>x.name == req.body.name);
    //let isExist2 = allData.filter(x=>x.name == req.body.name)[0];
    if(isExist){
      res.status(400).json({message:"that name is taken"});
    }else{
      next();
    }*/
    //END KÖTÜ ÖRNEK

    // BEGIN İYİ ÖRNEK
    const isExistWithName = await accountsModel.getByName(req.body.name);
    if(isExistWithName){
      res.status(400).json({message:"that name is taken"});
    }else{
      next();
    }
    // END İYİ ÖRNEK

  } catch (error) {
    res.status(400).json({message:error.message});
 }
}

exports.checkAccountId = async (req, res, next) => {
  // KODLAR BURAYA
  try {
    let isExist = await accountsModel.getById(req.params.id);
    if(!isExist){
      res.status(404).json({message:"account not found"});
    }
    else{
      req.Account = isExist;
      next();
    }
  } catch (error) {
    next(error);
  }
}
