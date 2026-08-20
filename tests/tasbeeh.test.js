
const request = require(`supertest`);//supertest ko is file main lai kr aa rha hai.
const app = require(`../app`);// Express.js app ko import kr rha hai, aur ye app.js file main defined hai.

test(`GET / should return welcome message`,async function(){

    const response = await request(app).get(`/`);// Ye line Get request behj rhi hai root route par(/), aur usko aik variable main store kr rhi hai.
    expect(response.statusCode).toBe(200);// response ks status code ko check kr rha hai, aur dekh rha hai ky yai 200 hona chaheye hai.
    expect(response.text).toBe(`Welcome to Tasbeeh Trainer API`);//Response mein exactly ye message hona chahiye.
});

//GET /tasbeeh route ko test kr rha hai, aur ye check kr rha hai ky API sahi se kaam kr rhi hai ya nahi.
test(`GET /tasbeeh should return all tasbeeh`,async function(){
    const response = await request(app).get(`/tasbeeh`);
    expect(response.statusCode).toBe(200);//API successful honi chahiye.
    expect(Array.isArray(response.body)).toBe(true);//Response body aik array honi chahiye.
    expect(response.body.length).toBeGreaterThan(0);//Array empty nahi honi chahiye.
});

test(`POST /tasbeeh should create a new tasbeeh`,async function(){
    const newTasbeeh = {
        name: `Darood`,
        category: `Daily`,
        target: 100
    };
    const response = await request(app).post(`/tasbeeh`).send(newTasbeeh);//Ye line API ko Post request bhej rhi hai, aur request main object bhej rhi hai.
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe(newTasbeeh.name);//check karta hai ke server ne wahi Tasbeeh return ki jo humne bheji thi.
    expect(response.body.category).toBe(newTasbeeh.category);
    expect(response.body.target).toBe(newTasbeeh.target);
    expect(response.body.id).toBeDefined();//Response body mein id defined honi chahiye.check karta hai ke server ne ID generate ki hai.

});

//1st failure test case
test(`POST /tasbeeh should reject missing required fields`,async function(){
     const response = await request(app).post(`/tasbeeh`).send({
        name : `Darood`
     });
     expect(response.statusCode).toBe(400);//bad request status code aana chahiye, kyunki required fields missing hai.
     expect(response.body.message).toBe(`Name, target and category are required fields and target must be greater than 0`);
    
});

//Test02 hai(failure test case)

test(`POST /tasbeeh should reject invalid target`, async function(){
    const response = await request(app).post(`/tasbeeh`).send({//request(app).post(...) immediately response nahi deta. Ye ek Promise return karta hai. isi liye await likhty hen
         name: "Durood Shareef",
            category: "Daily",
            target: -90
    });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe(`Name, target and category are required fields and target must be greater than 0`);
});