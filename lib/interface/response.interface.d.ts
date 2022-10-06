export interface Response {
    id: number;
    result?: any;
    error?: {
        code: number;
        message: string;
    };
}
