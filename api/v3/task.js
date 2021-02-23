const express = require("express");
const fs = require("fs");
const { v4: uuid } = require('uuid')

const router = express.Router();

router.use(express.json());

router.get("/", (request, response) => {
    const listOfObjectsFound = [];
    try {
        fs.readdirSync('./jsonFiles').forEach(file => {
            const fileContent = fs.readFileSync(
                `./jsonFiles/${file}`,
                { encoding: 'utf8', flag: 'r' });
            const fileContentJson = JSON.parse(fileContent);
            listOfObjectsFound.push(fileContentJson);
        });
        response.send(listOfObjectsFound);
    }
    catch (e) {
        response.status(500).json({
            "message": "Couldn't get files list",
            "error": e,
            "success": false
        });
    }
});

router.get("/:id", (request, response) => {
    const { id } = request.params;
    if (id.length != 36) {
        return response.status(400).json({ message: "illegal ID" })
    }
    try {
        const data = fs.readFileSync(
            `./jsonFiles/${id}.json`,
            { encoding: 'utf8', flag: 'r' });
        const dataJson = JSON.parse(data);
        response.status(200).send(dataJson);
    }
    catch {
        response.status(404).json({ message: "Bad ID, not found" });
    }
});

router.post("/", (request, response) => {
    const { body } = request;
    try {
        fs.writeFileSync(
            `./jsonFiles/${uuid()}.json`,
            JSON.stringify(body, null, 4)
        );
        response.status(200).json({
            "body": body,
        })
    } catch (e) {
        response.status(400).json({
            "message": "Couldn't create file",
            "error": e,
            "success": false
        });
    }
});

router.put("/:id", (request, response) => {
    const { id } = request.params;
    const { body } = request;
    const fileExists = fs.existsSync(`./jsonFiles/${id}.json`);

    if (id.length != 36) {
        return response.status(400).json({ message: "illegal ID" });
    } else if (!fileExists) {
        response.status(404).json(
            {
                "message": "File not found",
                "success": false
            });
        return;
    }
    fs.writeFileSync(`./jsonFiles/${id}.json`,
        JSON.stringify(body, null, 4));
    return response.status(200).json({
        "body": body,
        "message": 'Success',
        "id": id
    }
    );
});

router.delete("/:id", (request, response) => {
    const { id } = request.params;
    const fileExists = fs.existsSync(`./jsonFiles/${id}.json`);

    if (id.length != 36) {
        return response.status(400).json(
            {
                message: "illegal ID",
                "success": false
            });
    } else if (!fileExists) {
        return response.status(404).json(
            {
                "message": "File not found",
                "success": false
            });
        ;
    }
    fs.unlinkSync(`./jsonFiles/${id}.json`);
    return response.status(200).json({
        "message": "File deleted",
        "success": true
    });
})

module.exports = router;