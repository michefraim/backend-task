const request = require("supertest");
const fs = require('fs');
const app = require("../app")
let toDeleteID;

const expectedById = {
    "name": "Michael",
    "lastName": "Efraim",
    "Email": "michefraim@gmail.com"
};

describe('GET a file by ID', () => {
    it('Should return an JSON from file by id', async () => {
        const response = await request(app).get('/api/v3/b/5afb1007-b341-4026-b343-2c940ce2ef44');

        expect(response.status).toBe(200);
        expect(response.body.name).toEqual('Michael');
        expect(response.body.lastName).toEqual('Efraim');
        expect(response.body.Email).toEqual('michefraim@gmail.com');

    });

    it('should return an error message of bad ID', async () => {
        const response = await request(app).get('/api/v3/b/4343');

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual('illegal ID');
    });

    it('Should return an error message of ID not found', async () => {
        const response = await request(app).get('/api/v3/b/5afb1007-b341-4026-b343-2c940ce2ef55')
        expect(response.status).toBe(404);
        expect(response.body.message).toEqual("Bad ID, not found");
    });
});

describe('POST', () => {
    const expectedByPost = {
        "body": {
            "name": "Michael",
            "lastName": "Efraim",
            "Email": "michefraim@gmail.com"
        }
    };

    it('should create a new file and return the JSON', async () => {
        const response = await request(app).post('/api/v3/b').send(expectedById);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedByPost);
        // todeleteId = response.id
    });
})

describe('PUT', () => {
    const requestBodyPut =
    {
        "name": "Michael",
        "lastName": "Efraim",
        "Email": "michefraim@gmail.com"
    };

    const expectedByPut =
    {
        "body":
        {
            "name": "Michael",
            "lastName": "Efraim",
            "Email": "michefraim@gmail.com"
        },
        "id": '2dff3c80-0a54-4570-b6ad-a348aeade7c2',
        "message": 'Success'
    }


    it('Should update an existing file and return the content', async () => {
        const response = await request(app).put('/api/v3/b/2dff3c80-0a54-4570-b6ad-a348aeade7c2').send(requestBodyPut);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedByPut);
    });

    const fileCountBefore = fs.readdirSync('./jsonFiles');

    it('No new file is created by PUT', async () => {
        const fileCountAfter = await fs.readdirSync('./jsonFiles');
        const response = await request(app).put('/api/v3/b/2dff3c80-0a54-4570-b6ad-a348aeade7c2').send(requestBodyPut);

        expect(response.status).toBe(200);
        expect(fileCountBefore.length).toEqual(fileCountAfter.length - 1);
    });

    it('illegal ID sent need to return an error', async () => {
        const response = await request(app).put('/api/v3/b/77').send(requestBodyPut);

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("illegal ID");
    });

    it('legal ID sent but not found error', async () => {
        const response = await request(app).put('/api/v3/b/773762e5-aa93-5d1c-a2a8-886c523a8c44').send(requestBodyPut);

        expect(response.status).toBe(404);
        expect(response.body.message).toEqual("File not found");
    });
});


describe('DELETE', () => {
    let doesFileExist = true;
    it('Should delete a JSON file by ID received', async () => {
        const response = await request(app).delete('/api/v3/b/ddaf153c-75a6-4e59-b12c-024ce6fb9fb7');
        doesFileExist = await fs.existsSync(`./jsonFiles/ddaf153c-75a6-4e59-b12c-024ce6fb9fb7.json`);

        expect(doesFileExist).toBe(false);
        expect(response.status).toBe(200);
    });

    it('Illegal id error should be returned', async () => {
        const response = await request(app).delete('/api/v3/b/4343');

        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("illegal ID");
    });

    it("If non exist ID sent, should return an error of file not found", async () => {
        const response = await request(app).delete('/api/v3/b/ddaf153c-75a6-4e59-b12c-024ce6fb9fb7');
        
        expect(response.status).toBe(404);
        expect(response.body.message).toEqual("File not found");
    })
})

