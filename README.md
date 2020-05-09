### Reactivities
#### Social Event Application: Asp.net core and React 

#### MS SQL Database


### Commands Dotnet

>> Add Migration using EF: dotnet ef migrations add InitialCommitSetupProject -p Persistent/ -s API/
>> dotnet ef migrations add "AddedIdentity" -p Persistent/ -s API/


>> Update Database: dotnet ef database update -p Persistent/ -s API/

>> Remove Migration: dotnet ef migrations remove --project Persistent -s API

Watch Run: dotnet watch run (works only inside the startup project)


### Commands react app
>> Create application: npx create-react-app my-app --use-npm --typescript
>> Start: npm start
>> Check user-secrets: dotnet user-secrets list



### Back end installation
MediatR 7.0

AutoMapper.Extentions.Microsoft.DependencyInjection - 6.1.1 - Application Business Logic

Microsoft.EntityFrameworkCore.Proxies - 2.2.6 Persistent Project (Lasizn loading) 

* To access secret.json file, click with the right button on the project and click on Manage User Secrets. The json file will open.

* MYSQL: Pomelo.EntityFrameworkCore.MySql 2.2.0


### Front end installation
##### Axios: npm install axios
##### Semantic UI: npm install semantic-ui-react 
##### uuid for Guid
##### npm install mobx mobx-react-lite (5.14.2, 1.5.0)
##### npm install react-router-dom
##### npm install react-toastify
##### npm install react-final-form@6.3.0 final-form@4.16.1 (Form validations)
##### npm install react-widgets react-widgets-date-fns
##### npm install revalidate
##### npm install npm install --save react-dropzone@10.1.5
##### npm install --save react-cropper@1.2.0
##### npm install @microsoft/signalr@3.1.3
##### npm install react-infinite-scroller




