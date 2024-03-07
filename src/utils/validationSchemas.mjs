export const createUserValidationSchema ={
    name:{
        isString:{
            errorMessage:
                "Just string no numbers",
        }, // true if there is no other options to add.
         //isLength:{
            //options:{    this is what it looks if there is options to add.
                //min:2,
                //max:5
                //}
        
    },
    location:{
        isString:{
            errorMessage:
                "Just string no numbers",
        }, // true if there is no other options to add.
         //isLength:{
            //options:{    this is what it looks if there is options to add.
                //min:2,
                //max:5
                //}
        
    },
}