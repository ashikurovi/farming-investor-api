export interface JwtPayload {
    sub: number;
    email: string;
    role: string;
}
export declare const CurrentUser: (...dataOrPipes: (import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | keyof JwtPayload)[]) => ParameterDecorator;
