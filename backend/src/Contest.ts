import { randomUUID } from "crypto";

export class Contest {
    public id: string;
    public startTime: Date = new Date();
    public participant1: string;
    public participant2: string | null;
    public problem: string;

    constructor(
        participant1: string,
        participant2: string | null,
        startTime?: Date,
        gameId?: string
    ) {
        this.participant1 = participant1;
        this.participant2 = participant2;
        this.id = gameId ?? randomUUID();
        this.problem = "";
    }
}
