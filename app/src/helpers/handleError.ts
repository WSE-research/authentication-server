import { ErrorResponses } from "../defaultResponses";

export default function handleError(req: any, res: any, errorMessage: string): void {
    console.error(
        {
            errorMessage,
            requestBody: req.body,
            requestParams: req.params,
            timestamp: +Date.now(),
        }
    );
    res.status(500).json(ErrorResponses.InternalServerError);
}