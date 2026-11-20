export type SignupFormData = {
    username: string;
    email: string;
    password: string;
    sport: string;
};

export type SportOption = {
    value: 'Swimming' | 'Running';
};

export type SigninFormData = {
    email: string;
    password: string;
};