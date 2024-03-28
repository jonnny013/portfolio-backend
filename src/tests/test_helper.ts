const initialUser = {
  username: 'test123',
  password: 'test123',
}

const newUser = {
  username: 'test124',
  password: 'test123',
}

const sampleAboutMe = {
  name: 'nameHere',
  description:
    "Desc here",
  picDesc: 'pic Desc here',
  type: 'Certificate',
}

const premadeAboutMe = {
        "picture": "1706172907943.png",
        "name": "GraphQL",
        "description": "This is certification from University of Helsinki's GraphQL course. This course also included making websockets",
        "picDesc": "graphQL certificate",
        "dateAdded": "2024-01-25T08:55:07.000Z",
        "type": "Certificate",
        "id": "65b221eb4eda10659a1c20bf"
    }

const sampleProject = {
  title: 'Sample Project',
  project: 'Sample Project',
  description: 'This is a sample project description.',
  website: 'https://www.sampleproject.com',
  sourceCode: 'https://github.com/sample/sample-project',
  skills: {
    css: true,
    html: true,
    node: true,
    react: true,
    bootstrap: false,
    materialUI: false,
    mongoDB: true,
    express: true,
    javascript: true,
    typescript: false,
  },
  recommended: true,
}

const initialProject = {
  title: 'E-commerce Platform',
  project: 'E-commerce Platform',
  description: 'An e-commerce platform for selling electronics and gadgets.',
  website: 'https://www.ecommerceplatform.com',
  sourceCode: 'https://github.com/ecommerce/platform',
  skills: {
    css: true,
    html: true,
    node: true,
    react: true,
    bootstrap: false, 
    materialUI: false, 
    mongoDB: true,
    express: true,
    javascript: true,
    typescript: false, 
  },
  recommended: true,
}


export default {
  initialUser,
  newUser,
  sampleProject,
  initialProject,
  sampleAboutMe,
  premadeAboutMe,
}