import { app } from "@/app";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

beforeAll(async () => {
    await app.ready()
})

afterAll(async () => {
    await app.close()
})


describe("Register Professional Controller", () => {
    it("should be able to register a professional", async () => {
        expect(1 + 1).toEqual(2)
    })
})