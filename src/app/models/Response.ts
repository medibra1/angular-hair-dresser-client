export interface IResponse {
    status: number;
    result: {} | [];
    message: string | string[]
    code: number;
}