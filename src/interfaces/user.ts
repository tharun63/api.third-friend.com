export interface AddressInterface {
    line_one?: string
    line_two?: string
    street?: string
    city: string
    state: string
    zip: string
}



export interface UserInterface {
    _id?: string
    first_name: string
    last_name: string
    email?: string
    phone?: string
    address: AddressInterface
    user_type: string
    user_status?: string
    password: string
    username: string
}