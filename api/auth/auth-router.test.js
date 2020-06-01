const request = require("supertest");
const server = require("../server");

describe("auth", () => {
    describe("POST: /register", () => {
        it("returns JSON type", async () => {
            const res = await request(server).post("/api/auth/register");
            expect(res.type).toBe("application/json");
        });

        it("returns 401 when no body sent", async () => {
            const res = await request(server).post("/api/auth/register");
            expect(res.status).toBe(400);
        });

        it("returns 401 when invalid body sent", async () => {
            const res = await request(server)
                .post("/api/auth/register")
                .send({ notUsername: "bla", notPassword: "bla" });
            const res2 = await request(server)
                .post("/api/auth/register")
                .send({ username: "bla", notPassword: "bla" });
            const res3 = await request(server)
                .post("/api/auth/register")
                .send({ notUsername: "bla", password: "bla" });
            expect(res.status).toBe(400);
            expect(res2.status).toBe(400);
            expect(res3.status).toBe(400);
        });

        it("returns 200 on valid req-body", async () => {
            const res = await request(server)
                .post("/api/auth/register")
                .send({ username: "bla", password: "bla" });
            expect(res.status).toBe(200);
        });

        it("returns username if successful", async () => {
            const res = await request(server)
                .post("/api/auth/register")
                .send({ username: "user", password: "pass" });
            expect(res.body.username).toBe("user");
        });
    });

    describe("POST: /login", () => {
        it("returns JSON type", async () => {
            const res = await request(server).post("/api/auth/login");
            expect(res.type).toBe("application/json");
        });

        it("returns 401 when no body sent", async () => {
            const res = await request(server).post("/api/auth/login");
            expect(res.status).toBe(400);
        });

        it("returns 401 when invalid body sent", async () => {
            const res = await request(server)
                .post("/api/auth/login")
                .send({ notUsername: "bla", notPassword: "bla" });
            const res2 = await request(server)
                .post("/api/auth/login")
                .send({ username: "bla", notPassword: "bla" });
            const res3 = await request(server)
                .post("/api/auth/login")
                .send({ notUsername: "bla", password: "bla" });
            expect(res.status).toBe(400);
            expect(res2.status).toBe(400);
            expect(res3.status).toBe(400);
        });

        it("returns 200 on valid req-body", async () => {
            const res = await request(server)
                .post("/api/auth/login")
                .send({ username: "user", password: "pass" });
            expect(res.status).toBe(200);
        });
    });
});
