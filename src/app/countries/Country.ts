export interface Country {
    name: string,
    currency: string,
    capital?: string,
    code: string,
    phone: string,
    continent: {
        name: string
    }
    languages?: [
        {name: string}
    ]
}