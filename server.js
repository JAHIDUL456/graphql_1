import express from 'express';
import {graphqlHTTP} from 'express-graphql';
import { buildSchema } from 'graphql';


const app= express();

const schema=buildSchema(`
    
    type User{
    id : ID!
    name:String!
    }
    
    type Query{
    getUser(id:ID!):User
    getUsers:[User]}
    
    type Mutation{
    addUser(name:String!):User
    updateUser(id:ID!,name:String!):User
    deleteUser(id:ID!):String}`);


    let users=[];


    const root={
        getUser:({id})=>users.find(user=>user.id===id),
        getUsers:()=>users,


        addUser:({name})=>{

            const user={id:users.length+1,name};
            users.push(user);
            return user;
        },

        updateUser:({id,name})=>{
            const user=users.find(user=>user.id===id);
            if(!user) throw new Error("User not found");
            user.name=name;
            return user;
        },

        deleteUser:({id})=>{
            const userIndex=users.findIndex(user=>user.id===id);
            if(userIndex===-1) throw new Error("User not found");
            users.splice(userIndex,1);
            return "User deleted successfully";
        }
    };

    app.use('/graphql',graphqlHTTP({
        schema,
        rootValue:root,
        graphiql:true
    }));

    app.listen(4000,()=>console.log("Server running on port 4000"));