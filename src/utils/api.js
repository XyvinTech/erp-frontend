const BaseUrl = import.meta.env.VITE_API_URL;

const loginEndpoint = import.meta.env.VITE_LOGIN_URL;
const eventsEndpoint  = import.meta.env.VITE_EVENTS_URL




export const LOGIN_API = BaseUrl + loginEndpoint;
export const Events_API = BaseUrl + eventsEndpoint;
